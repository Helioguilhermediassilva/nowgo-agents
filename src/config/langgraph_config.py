"""
Configuração do LangGraph para fluxos de trabalho de agentes
"""

import os
from typing import Dict, Any, List, Optional
from langchain_core.language_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.agents import AgentExecutor
from langchain.agents.format_scratchpad import format_to_openai_function_messages
from langchain.agents.output_parsers import OpenAIFunctionsAgentOutputParser
from langchain.tools.render import format_tool_to_openai_function
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

class LangGraphBuilder:
    """
    Construtor de grafos para fluxos de trabalho de agentes usando LangGraph.
    """
    
    def __init__(self, llm: BaseChatModel):
        """
        Inicializa o construtor de grafos.
        
        Args:
            llm: Modelo de linguagem para o agente
        """
        self.llm = llm
    
    def create_sequential_agent_graph(self, 
                                     tools: List[Any], 
                                     system_prompt: str) -> StateGraph:
        """
        Cria um grafo sequencial para um agente.
        
        Args:
            tools: Lista de ferramentas disponíveis para o agente
            system_prompt: Prompt do sistema para o agente
            
        Returns:
            Grafo do agente
        """
        # Converter ferramentas para formato OpenAI
        functions = [format_tool_to_openai_function(tool) for tool in tools]
        
        # Criar prompt do agente
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
            ("agent", "{agent_scratchpad}")
        ])
        
        # Criar agente
        agent = (
            prompt
            | self.llm.bind_functions(functions)
            | OpenAIFunctionsAgentOutputParser()
        )
        
        # Criar nó de ferramentas
        tool_node = ToolNode(tools)
        
        # Criar grafo
        workflow = StateGraph(inputs=["input", "agent_scratchpad"])
        
        # Adicionar nós
        workflow.add_node("agent", agent)
        workflow.add_node("tools", tool_node)
        
        # Adicionar arestas
        workflow.add_edge("agent", "tools")
        workflow.add_conditional_edges(
            "tools",
            lambda state: "agent" if state.get("next_action") else END
        )
        
        # Compilar grafo
        return workflow.compile()
    
    def create_parallel_agent_graph(self, 
                                   agent_configs: List[Dict[str, Any]]) -> StateGraph:
        """
        Cria um grafo paralelo com múltiplos agentes.
        
        Args:
            agent_configs: Lista de configurações de agentes
            
        Returns:
            Grafo paralelo
        """
        # Criar grafo
        workflow = StateGraph(inputs=["input"])
        
        # Adicionar nós de agentes
        for i, config in enumerate(agent_configs):
            agent_name = f"agent_{i}"
            agent_executor = self._create_agent_executor(
                config["tools"],
                config["system_prompt"]
            )
            workflow.add_node(agent_name, agent_executor)
        
        # Adicionar nó de agregação
        workflow.add_node("aggregator", self._create_aggregator())
        
        # Adicionar arestas
        for i in range(len(agent_configs)):
            agent_name = f"agent_{i}"
            workflow.add_edge("__start__", agent_name)
            workflow.add_edge(agent_name, "aggregator")
        
        workflow.add_edge("aggregator", END)
        
        # Compilar grafo
        return workflow.compile()
    
    def create_workflow_agent_graph(self, 
                                   workflow_steps: List[Dict[str, Any]]) -> StateGraph:
        """
        Cria um grafo de fluxo de trabalho com múltiplos passos.
        
        Args:
            workflow_steps: Lista de passos do fluxo de trabalho
            
        Returns:
            Grafo de fluxo de trabalho
        """
        # Criar grafo
        workflow = StateGraph(inputs=["input"])
        
        # Adicionar nós de passos
        for i, step in enumerate(workflow_steps):
            step_name = f"step_{i}"
            
            if step["type"] == "agent":
                node = self._create_agent_executor(
                    step["tools"],
                    step["system_prompt"]
                )
            elif step["type"] == "tool":
                node = ToolNode([step["tool"]])
            else:
                raise ValueError(f"Tipo de passo desconhecido: {step['type']}")
            
            workflow.add_node(step_name, node)
        
        # Adicionar arestas
        workflow.add_edge("__start__", "step_0")
        
        for i in range(len(workflow_steps) - 1):
            workflow.add_edge(f"step_{i}", f"step_{i+1}")
        
        workflow.add_edge(f"step_{len(workflow_steps)-1}", END)
        
        # Compilar grafo
        return workflow.compile()
    
    def _create_agent_executor(self, tools: List[Any], system_prompt: str) -> AgentExecutor:
        """
        Cria um executor de agente.
        
        Args:
            tools: Lista de ferramentas disponíveis para o agente
            system_prompt: Prompt do sistema para o agente
            
        Returns:
            Executor de agente
        """
        # Converter ferramentas para formato OpenAI
        functions = [format_tool_to_openai_function(tool) for tool in tools]
        
        # Criar prompt do agente
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
            ("agent", "{agent_scratchpad}")
        ])
        
        # Criar cadeia do agente
        agent_chain = (
            prompt
            | self.llm.bind_functions(functions)
            | OpenAIFunctionsAgentOutputParser()
        )
        
        # Criar executor de agente
        return AgentExecutor(
            agent=agent_chain,
            tools=tools,
            handle_parsing_errors=True
        )
    
    def _create_aggregator(self):
        """
        Cria um nó agregador para combinar resultados de múltiplos agentes.
        
        Returns:
            Função agregadora
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Você é um assistente que agrega resultados de múltiplos agentes. "
                      "Combine as informações de forma coerente e elimine redundâncias."),
            ("human", "Combine os seguintes resultados:\n\n{results}")
        ])
        
        chain = prompt | self.llm | StrOutputParser()
        
        def aggregator(state):
            results = state["results"]
            combined = chain.invoke({"results": "\n\n".join(results)})
            return {"output": combined}
        
        return aggregator
