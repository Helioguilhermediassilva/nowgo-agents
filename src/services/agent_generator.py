"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ Serviço de Geração Automática de Agentes                                    │
│                                                                             │
│ Este serviço implementa a geração automática de agentes personalizados      │
│ com base nos resultados da análise organizacional.                          │
└─────────────────────────────────────────────────────────────────────────────┘
"""

from typing import Dict, List, Any, Optional
import json
from datetime import datetime
import uuid

from src.models.models import Agent, AgentConfiguration, Organization, OrganizationAnalysis
from src.models.organization_analyzer import OrganizationAnalyzer
from src.services.adk.agent_builder import AgentBuilder
from src.services.adk.custom_agents.llm_agent import LLMAgent
from src.services.adk.custom_agents.workflow_agent import WorkflowAgent

class AgentGenerator:
    """
    Gerador automático de agentes personalizados com base em análise organizacional.
    
    Esta classe implementa a lógica para:
    1. Interpretar resultados de análise organizacional
    2. Gerar configurações de agentes personalizados
    3. Criar e configurar instâncias de agentes
    4. Registrar agentes no sistema
    """
    
    def __init__(self, db_session):
        """
        Inicializa o gerador de agentes.
        
        Args:
            db_session: Sessão do banco de dados para persistência
        """
        self.db_session = db_session
        self.agent_builder = AgentBuilder()
        
        # Templates de prompts para diferentes tipos de agentes
        self.prompt_templates = {
            "customer_support": """
            Você é Virginia, uma assistente virtual de atendimento ao cliente da {organization_name}.
            
            Seu objetivo é fornecer suporte excepcional aos clientes, respondendo dúvidas, 
            resolvendo problemas e garantindo uma experiência positiva.
            
            Informações sobre a empresa:
            - Nome: {organization_name}
            - Setor: {industry}
            - Descrição: {description}
            
            Diretrizes de comunicação:
            - Seja sempre cordial e profissional
            - Responda de forma clara e objetiva
            - Demonstre empatia com os problemas dos clientes
            - Ofereça soluções práticas e eficientes
            - Escale para um humano quando necessário
            
            Idiomas suportados: {languages}
            """,
            
            "sales": """
            Você é Guilherme, um assistente virtual de vendas e prospecção da {organization_name}.
            
            Seu objetivo é identificar oportunidades de negócio, qualificar leads e agendar 
            reuniões com a equipe comercial, sempre de forma amigável e persuasiva, mas leve.
            
            Informações sobre a empresa:
            - Nome: {organization_name}
            - Setor: {industry}
            - Descrição: {description}
            
            Diretrizes de comunicação:
            - Seja amigável e construa rapport rapidamente
            - Identifique necessidades e dores do cliente
            - Apresente soluções de forma persuasiva
            - Destaque benefícios e não apenas características
            - Conduza o cliente para o próximo passo do funil
            - Agende reuniões com a equipe comercial quando apropriado
            
            Idiomas suportados: {languages}
            """,
            
            "marketing": """
            Você é Amanda, uma assistente virtual de marketing da {organization_name}.
            
            Seu objetivo é engajar leads, nutrir relacionamentos e converter prospects 
            em clientes através de comunicação personalizada e relevante.
            
            Informações sobre a empresa:
            - Nome: {organization_name}
            - Setor: {industry}
            - Descrição: {description}
            
            Diretrizes de comunicação:
            - Personalize mensagens com base no perfil do contato
            - Forneça conteúdo relevante e de valor
            - Mantenha tom consistente com a marca
            - Identifique sinais de interesse para qualificação
            - Encaminhe leads qualificados para a equipe de vendas
            
            Idiomas suportados: {languages}
            """,
            
            "finance": """
            Você é Ricardo, um assistente virtual financeiro da {organization_name}.
            
            Seu objetivo é fornecer análises financeiras, relatórios e insights 
            para apoiar decisões estratégicas da empresa.
            
            Informações sobre a empresa:
            - Nome: {organization_name}
            - Setor: {industry}
            - Descrição: {description}
            
            Diretrizes de comunicação:
            - Seja preciso e objetivo nas análises
            - Apresente dados de forma clara e estruturada
            - Destaque tendências e anomalias relevantes
            - Sugira ações baseadas em dados
            - Mantenha confidencialidade das informações
            
            Idiomas suportados: {languages}
            """,
            
            "hr": """
            Você é Helena, uma assistente virtual de recursos humanos da {organization_name}.
            
            Seu objetivo é otimizar processos de recrutamento, seleção e onboarding,
            além de fornecer suporte aos colaboradores em questões de RH.
            
            Informações sobre a empresa:
            - Nome: {organization_name}
            - Setor: {industry}
            - Descrição: {description}
            
            Diretrizes de comunicação:
            - Seja acolhedora e empática
            - Forneça informações precisas sobre políticas e benefícios
            - Conduza triagens iniciais de candidatos
            - Agende entrevistas e acompanhe processos seletivos
            - Apoie novos colaboradores no processo de onboarding
            
            Idiomas suportados: {languages}
            """
        }
    
    def generate_agents_from_analysis(self, analysis_id: int, tenant_id: int, user_id: int) -> List[Dict[str, Any]]:
        """
        Gera agentes personalizados com base nos resultados de uma análise organizacional.
        
        Args:
            analysis_id: ID da análise organizacional
            tenant_id: ID do tenant para isolamento multi-tenant
            user_id: ID do usuário que solicitou a geração
            
        Returns:
            Lista de agentes gerados com seus IDs e configurações
        """
        # Buscar análise no banco de dados
        analysis = self.db_session.query(OrganizationAnalysis).filter(
            OrganizationAnalysis.id == analysis_id,
            OrganizationAnalysis.tenant_id == tenant_id
        ).first()
        
        if not analysis:
            raise ValueError(f"Análise com ID {analysis_id} não encontrada")
        
        # Buscar organização associada à análise
        organization = self.db_session.query(Organization).filter(
            Organization.id == analysis.organization_id
        ).first()
        
        if not organization:
            raise ValueError(f"Organização associada à análise {analysis_id} não encontrada")
        
        # Extrair agentes recomendados da análise
        recommended_agents = analysis.results.get("recommendedAgents", [])
        if not recommended_agents:
            raise ValueError(f"Nenhum agente recomendado encontrado na análise {analysis_id}")
        
        # Gerar agentes com base nas recomendações
        generated_agents = []
        
        for agent_rec in recommended_agents:
            agent_id = agent_rec.get("id")
            agent_type = agent_rec.get("type")
            agent_name = agent_rec.get("name")
            
            # Preparar dados para o prompt
            prompt_data = {
                "organization_name": organization.name,
                "industry": organization.industry,
                "description": organization.description,
                "languages": ", ".join([
                    lang for lang, enabled in analysis.results.get("summary", {}).get("languages", {}).items()
                    if enabled
                ])
            }
            
            # Obter template de prompt para o tipo de agente
            prompt_template = self.prompt_templates.get(agent_type)
            if not prompt_template:
                # Usar template genérico se não houver específico
                prompt_template = f"Você é {agent_name}, um assistente virtual da {organization.name}."
            
            # Formatar prompt com dados da organização
            prompt = prompt_template.format(**prompt_data)
            
            # Configurar canais de comunicação
            channels = {}
            for channel, enabled in analysis.results.get("summary", {}).get("channels", {}).items():
                if enabled:
                    channels[channel] = {
                        "enabled": True,
                        "configuration": self._get_default_channel_config(channel)
                    }
            
            # Criar configuração do agente
            agent_config = {
                "name": agent_name,
                "description": agent_rec.get("description", ""),
                "type": agent_type,
                "model": "gpt-4",  # Modelo padrão
                "prompt": prompt,
                "channels": channels,
                "languages": {
                    lang: {"enabled": True}
                    for lang, enabled in analysis.results.get("summary", {}).get("languages", {}).items()
                    if enabled
                },
                "integrations": {
                    integration: {"enabled": True}
                    for integration, enabled in analysis.results.get("summary", {}).get("integrations", {}).items()
                    if enabled
                },
                "metadata": {
                    "generated_from_analysis": analysis_id,
                    "confidence_score": agent_rec.get("confidence", 0),
                    "generation_date": datetime.now().isoformat()
                }
            }
            
            # Criar agente no banco de dados
            agent = Agent(
                name=agent_name,
                description=agent_rec.get("description", ""),
                type=agent_type,
                tenant_id=tenant_id,
                created_by=user_id,
                folder_id=None  # Pasta padrão
            )
            self.db_session.add(agent)
            self.db_session.flush()  # Obter ID do agente
            
            # Criar configuração do agente no banco de dados
            agent_configuration = AgentConfiguration(
                agent_id=agent.id,
                configuration=agent_config,
                version=1,
                is_active=True
            )
            self.db_session.add(agent_configuration)
            
            # Criar instância do agente usando o AgentBuilder
            agent_instance = self._create_agent_instance(agent.id, agent_type, agent_config)
            
            # Adicionar à lista de agentes gerados
            generated_agents.append({
                "id": agent.id,
                "name": agent_name,
                "type": agent_type,
                "description": agent_rec.get("description", ""),
                "configuration": agent_config
            })
        
        # Persistir mudanças no banco de dados
        self.db_session.commit()
        
        return generated_agents
    
    def _create_agent_instance(self, agent_id: int, agent_type: str, config: Dict[str, Any]) -> Any:
        """
        Cria uma instância do agente com base no tipo e configuração.
        
        Args:
            agent_id: ID do agente
            agent_type: Tipo do agente
            config: Configuração do agente
            
        Returns:
            Instância do agente criado
        """
        # Mapear tipos de agentes para classes de implementação
        agent_type_mapping = {
            "customer_support": LLMAgent,
            "sales": LLMAgent,
            "marketing": LLMAgent,
            "finance": LLMAgent,
            "hr": LLMAgent
        }
        
        # Obter classe de implementação para o tipo de agente
        agent_class = agent_type_mapping.get(agent_type, LLMAgent)
        
        # Criar instância do agente
        agent_instance = self.agent_builder.build_agent(
            agent_id=str(agent_id),
            agent_type=agent_class.__name__,
            config=config
        )
        
        return agent_instance
    
    def _get_default_channel_config(self, channel: str) -> Dict[str, Any]:
        """
        Retorna configuração padrão para um canal de comunicação.
        
        Args:
            channel: Nome do canal
            
        Returns:
            Configuração padrão para o canal
        """
        # Configurações padrão por canal
        default_configs = {
            "whatsapp": {
                "greeting": "Olá! Sou o assistente virtual da {organization_name}. Como posso ajudar?",
                "signature": "Atenciosamente, {agent_name} - {organization_name}",
                "working_hours": "24/7"
            },
            "email": {
                "greeting": "Prezado(a),\n\nSou o assistente virtual da {organization_name}.",
                "signature": "Atenciosamente,\n{agent_name}\n{organization_name}",
                "subject_template": "[{organization_name}] - {subject}"
            },
            "phone": {
                "greeting": "Olá, você está falando com {agent_name} da {organization_name}. Como posso ajudar?",
                "voicemail": "Obrigado por sua ligação. Por favor, deixe uma mensagem após o sinal."
            },
            "linkedin": {
                "greeting": "Olá! Sou {agent_name}, assistente virtual da {organization_name}.",
                "connection_message": "Olá! Gostaria de conectar para discutir como a {organization_name} pode ajudar em seus desafios."
            }
        }
        
        return default_configs.get(channel, {})
