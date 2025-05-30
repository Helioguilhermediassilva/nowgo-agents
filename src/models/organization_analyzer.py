"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ Modelo de Analisador Organizacional                                         │
│                                                                             │
│ Este modelo implementa a lógica de análise organizacional para identificar  │
│ as necessidades específicas de uma empresa e recomendar os agentes mais     │
│ adequados com base em seu perfil.                                           │
└─────────────────────────────────────────────────────────────────────────────┘
"""

from typing import Dict, List, Any, Optional
import json
from datetime import datetime

class OrganizationAnalyzer:
    """
    Analisador organizacional que processa dados de empresas e recomenda agentes.
    
    Esta classe implementa a lógica de análise para:
    1. Processar dados organizacionais
    2. Identificar necessidades específicas
    3. Recomendar agentes personalizados
    4. Calcular pontuações de confiança
    """
    
    def __init__(self):
        # Inicializar configurações do analisador
        self.agent_templates = {
            "virginia": {
                "name": "Virginia",
                "type": "customer_support",
                "description": "Agente especializado em atendimento ao cliente com foco em resolução rápida e eficiente de problemas.",
                "benefits": [
                    "Atendimento 24/7 em múltiplos canais",
                    "Resolução rápida de problemas comuns",
                    "Escalação inteligente para humanos quando necessário"
                ],
                "channels": ["whatsapp", "email", "phone"],
                "languages": ["portuguese", "english", "spanish"],
                "integrations": ["crm", "helpdesk"]
            },
            "guilherme": {
                "name": "Guilherme",
                "type": "sales",
                "description": "Agente de vendas e prospecção com abordagem amigável e persuasiva para maximizar conversões.",
                "benefits": [
                    "Qualificação automática de leads",
                    "Acompanhamento personalizado do funil de vendas",
                    "Agendamento inteligente de reuniões com equipe comercial"
                ],
                "channels": ["whatsapp", "email", "linkedin"],
                "languages": ["portuguese", "english", "spanish"],
                "integrations": ["crm"]
            },
            "amanda": {
                "name": "Amanda",
                "type": "marketing",
                "description": "Agente de marketing digital especializado em engajamento e nutrição de leads.",
                "benefits": [
                    "Segmentação avançada de audiência",
                    "Personalização de mensagens por perfil",
                    "Análise de sentimento e ajuste de campanhas"
                ],
                "channels": ["email", "whatsapp"],
                "languages": ["portuguese", "english", "spanish"],
                "integrations": ["crm", "marketing_automation"]
            },
            "ricardo": {
                "name": "Ricardo",
                "type": "finance",
                "description": "Agente financeiro para análise de dados e suporte a decisões financeiras.",
                "benefits": [
                    "Análise de fluxo de caixa em tempo real",
                    "Previsões financeiras baseadas em tendências",
                    "Alertas de anomalias em transações"
                ],
                "channels": ["email", "internal_systems"],
                "languages": ["portuguese", "english"],
                "integrations": ["erp", "accounting_software"]
            },
            "helena": {
                "name": "Helena",
                "type": "hr",
                "description": "Agente de recursos humanos para processos de recrutamento e onboarding.",
                "benefits": [
                    "Triagem inicial de candidatos",
                    "Agendamento automático de entrevistas",
                    "Suporte ao onboarding de novos colaboradores"
                ],
                "channels": ["email", "internal_systems"],
                "languages": ["portuguese", "english", "spanish"],
                "integrations": ["hr_system"]
            }
        }
    
    def analyze(self, organization_data: Dict[str, Any], tenant_id: int) -> Dict[str, Any]:
        """
        Analisa os dados organizacionais e retorna recomendações de agentes.
        
        Args:
            organization_data: Dados da organização a ser analisada
            tenant_id: ID do tenant para isolamento multi-tenant
            
        Returns:
            Dicionário com resultados da análise e recomendações de agentes
        """
        # Extrair informações relevantes
        org_name = organization_data.get("name", "")
        industry = organization_data.get("industry", "")
        size = organization_data.get("size", "")
        channels = organization_data.get("channels", {})
        languages = organization_data.get("languages", {})
        integrations = organization_data.get("integrations", {})
        objectives = organization_data.get("objectives", {})
        
        # Calcular pontuações para cada agente com base nos dados organizacionais
        agent_scores = self._calculate_agent_scores(
            industry=industry,
            size=size,
            channels=channels,
            languages=languages,
            integrations=integrations,
            objectives=objectives
        )
        
        # Selecionar os agentes mais adequados (pontuação > 70)
        recommended_agents = []
        for agent_id, score in agent_scores.items():
            if score > 70:
                # Obter template do agente
                agent_template = self.agent_templates.get(agent_id, {})
                if not agent_template:
                    continue
                
                # Criar recomendação personalizada
                agent_recommendation = {
                    "id": agent_id,
                    "name": agent_template["name"],
                    "type": agent_template["type"],
                    "confidence": score,
                    "description": agent_template["description"],
                    "benefits": agent_template["benefits"],
                    "compatibility": {
                        "channels": self._calculate_compatibility(
                            channels, agent_template.get("channels", [])
                        ),
                        "languages": self._calculate_compatibility(
                            languages, agent_template.get("languages", [])
                        ),
                        "integrations": self._calculate_compatibility(
                            integrations, agent_template.get("integrations", [])
                        )
                    }
                }
                recommended_agents.append(agent_recommendation)
        
        # Ordenar agentes por pontuação (do maior para o menor)
        recommended_agents.sort(key=lambda x: x["confidence"], reverse=True)
        
        # Criar resumo da análise
        summary = {
            "organizationName": org_name,
            "industry": industry,
            "size": size,
            "channels": channels,
            "languages": languages,
            "integrations": integrations,
            "objectives": objectives,
            "analysisDate": datetime.now().isoformat(),
            "agentCount": len(recommended_agents)
        }
        
        # Retornar resultados completos
        return {
            "summary": summary,
            "recommendedAgents": recommended_agents,
            "rawScores": agent_scores
        }
    
    def _calculate_agent_scores(
        self,
        industry: str,
        size: str,
        channels: Dict[str, bool],
        languages: Dict[str, bool],
        integrations: Dict[str, bool],
        objectives: Dict[str, bool]
    ) -> Dict[str, int]:
        """
        Calcula pontuações para cada agente com base nos dados organizacionais.
        
        Returns:
            Dicionário com IDs dos agentes e suas pontuações
        """
        scores = {}
        
        # Mapeamento de indústrias para tipos de agentes prioritários
        industry_agent_mapping = {
            "technology": ["virginia", "guilherme", "amanda"],
            "finance": ["virginia", "guilherme", "ricardo"],
            "healthcare": ["virginia", "helena"],
            "education": ["virginia", "helena", "amanda"],
            "retail": ["virginia", "guilherme", "amanda"],
            "manufacturing": ["virginia", "ricardo"],
            "services": ["virginia", "guilherme"],
        }
        
        # Mapeamento de objetivos para tipos de agentes
        objective_agent_mapping = {
            "customer_support": ["virginia"],
            "sales": ["guilherme"],
            "marketing": ["amanda"],
            "internal_communication": ["helena"]
        }
        
        # Inicializar pontuações base para todos os agentes
        for agent_id in self.agent_templates:
            scores[agent_id] = 50  # Pontuação base
        
        # Ajustar pontuações com base na indústria
        industry_agents = industry_agent_mapping.get(industry, [])
        for agent_id in industry_agents:
            scores[agent_id] += 15
        
        # Ajustar pontuações com base nos objetivos
        for objective, is_selected in objectives.items():
            if is_selected:
                for agent_id in objective_agent_mapping.get(objective, []):
                    scores[agent_id] += 20
        
        # Ajustar pontuações com base nos canais
        for agent_id, agent_data in self.agent_templates.items():
            agent_channels = agent_data.get("channels", [])
            channel_match_count = 0
            channel_total = 0
            
            for channel, is_selected in channels.items():
                if is_selected:
                    channel_total += 1
                    if channel in agent_channels:
                        channel_match_count += 1
            
            if channel_total > 0:
                channel_score = (channel_match_count / channel_total) * 10
                scores[agent_id] += channel_score
        
        # Ajustar pontuações com base nos idiomas
        for agent_id, agent_data in self.agent_templates.items():
            agent_languages = agent_data.get("languages", [])
            language_match_count = 0
            language_total = 0
            
            for language, is_selected in languages.items():
                if is_selected:
                    language_total += 1
                    if language in agent_languages:
                        language_match_count += 1
            
            if language_total > 0:
                language_score = (language_match_count / language_total) * 10
                scores[agent_id] += language_score
        
        # Ajustar pontuações com base nas integrações
        for agent_id, agent_data in self.agent_templates.items():
            agent_integrations = agent_data.get("integrations", [])
            integration_match_count = 0
            integration_total = 0
            
            for integration, is_selected in integrations.items():
                if is_selected:
                    integration_total += 1
                    if integration in agent_integrations:
                        integration_match_count += 1
            
            if integration_total > 0:
                integration_score = (integration_match_count / integration_total) * 10
                scores[agent_id] += integration_score
        
        # Ajustar pontuações com base no tamanho da empresa
        if size == "small":
            # Pequenas empresas se beneficiam mais de agentes de vendas e atendimento
            scores["virginia"] += 5
            scores["guilherme"] += 10
        elif size == "medium":
            # Médias empresas se beneficiam de um mix equilibrado
            scores["virginia"] += 8
            scores["guilherme"] += 8
            scores["amanda"] += 5
        elif size == "large" or size == "enterprise":
            # Grandes empresas se beneficiam de todos os tipos de agentes
            scores["virginia"] += 10
            scores["guilherme"] += 8
            scores["amanda"] += 8
            scores["ricardo"] += 10
            scores["helena"] += 10
        
        # Garantir que as pontuações estejam no intervalo de 0-100
        for agent_id in scores:
            scores[agent_id] = max(0, min(100, scores[agent_id]))
        
        return scores
    
    def _calculate_compatibility(
        self,
        selected_items: Dict[str, bool],
        agent_supported_items: List[str]
    ) -> int:
        """
        Calcula a compatibilidade percentual entre itens selecionados e suportados.
        
        Args:
            selected_items: Dicionário de itens selecionados pelo usuário
            agent_supported_items: Lista de itens suportados pelo agente
            
        Returns:
            Percentual de compatibilidade (0-100)
        """
        selected = [item for item, is_selected in selected_items.items() if is_selected]
        
        if not selected:
            return 100  # Se nada foi selecionado, compatibilidade é 100%
        
        matches = [item for item in selected if item in agent_supported_items]
        
        return int((len(matches) / len(selected)) * 100)
