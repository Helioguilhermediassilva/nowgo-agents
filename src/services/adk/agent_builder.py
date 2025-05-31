"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ Construtor de Agentes                                                       │
│                                                                             │
│ Este módulo implementa a lógica de construção de diferentes tipos de        │
│ agentes com base em configurações específicas.                              │
└─────────────────────────────────────────────────────────────────────────────┘
"""

from typing import Dict, Any, Optional
import importlib
import logging

logger = logging.getLogger(__name__)

class AgentBuilder:
    """
    Construtor de agentes que cria instâncias de diferentes tipos de agentes
    com base em configurações específicas.
    """
    
    def __init__(self):
        """Inicializa o construtor de agentes."""
        self.agent_types = {
            "LLMAgent": "src.services.adk.custom_agents.llm_agent",
            "WorkflowAgent": "src.services.adk.custom_agents.workflow_agent",
            # Outros tipos de agentes podem ser adicionados aqui
        }
    
    def build_agent(self, agent_id: str, agent_type: str, config: Dict[str, Any]) -> Any:
        """
        Constrói um agente do tipo especificado com a configuração fornecida.
        
        Args:
            agent_id: ID único do agente
            agent_type: Tipo do agente a ser construído
            config: Configuração do agente
            
        Returns:
            Instância do agente construído
        """
        # Verificar se o tipo de agente é suportado
        if agent_type not in self.agent_types:
            raise ValueError(f"Tipo de agente não suportado: {agent_type}")
        
        try:
            # Importar dinamicamente o módulo do agente
            module_path = self.agent_types[agent_type]
            module = importlib.import_module(module_path)
            
            # Obter a classe do agente
            agent_class = getattr(module, agent_type)
            
            # Instanciar o agente com a configuração fornecida
            agent_instance = agent_class(agent_id=agent_id, config=config)
            
            logger.info(f"Agente {agent_type} construído com sucesso, ID: {agent_id}")
            
            return agent_instance
            
        except (ImportError, AttributeError) as e:
            logger.error(f"Erro ao construir agente {agent_type}: {str(e)}")
            raise
