"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ Esquemas para Análise Organizacional                                        │
│                                                                             │
│ Este arquivo define os esquemas Pydantic para validação e serialização      │
│ dos dados de análise organizacional.                                        │
└─────────────────────────────────────────────────────────────────────────────┘
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime

# Esquema para criação de análise organizacional
class OrganizationAnalysisCreate(BaseModel):
    """Esquema para dados de entrada da análise organizacional."""
    name: str = Field(..., description="Nome da organização")
    industry: str = Field(..., description="Setor da organização")
    size: str = Field(..., description="Tamanho da organização")
    description: str = Field(..., description="Descrição da organização")
    channels: Dict[str, bool] = Field(
        default_factory=dict,
        description="Canais de comunicação utilizados"
    )
    languages: Dict[str, bool] = Field(
        default_factory=dict,
        description="Idiomas suportados"
    )
    integrations: Dict[str, bool] = Field(
        default_factory=dict,
        description="Integrações com sistemas existentes"
    )
    objectives: Dict[str, bool] = Field(
        default_factory=dict,
        description="Objetivos da organização"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "name": "NowGo Holding",
                "industry": "technology",
                "size": "medium",
                "description": "Empresa de tecnologia focada em soluções inovadoras",
                "channels": {
                    "whatsapp": True,
                    "email": True,
                    "phone": True,
                    "linkedin": True
                },
                "languages": {
                    "portuguese": True,
                    "english": True,
                    "spanish": True
                },
                "integrations": {
                    "crm": True
                },
                "objectives": {
                    "customer_support": True,
                    "sales": True
                }
            }
        }

# Esquema para resposta de análise organizacional
class OrganizationAnalysisResponse(BaseModel):
    """Esquema para resposta da análise organizacional."""
    analysisId: int = Field(..., description="ID da análise")
    organizationName: str = Field(..., description="Nome da organização")
    summary: Dict[str, Any] = Field(
        default_factory=dict,
        description="Resumo da análise"
    )
    recommendedAgents: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Agentes recomendados"
    )
    status: str = Field(..., description="Status da análise")
    
    class Config:
        schema_extra = {
            "example": {
                "analysisId": 1,
                "organizationName": "NowGo Holding",
                "summary": {
                    "industry": "technology",
                    "size": "medium",
                    "channels": {"whatsapp": True, "email": True, "phone": True, "linkedin": True},
                    "languages": {"portuguese": True, "english": True, "spanish": True},
                    "integrations": {"crm": True},
                    "objectives": {"customer_support": True, "sales": True},
                    "analysisDate": "2025-05-30T20:32:30.000Z",
                    "agentCount": 2
                },
                "recommendedAgents": [
                    {
                        "id": "virginia",
                        "name": "Virginia",
                        "type": "customer_support",
                        "confidence": 95,
                        "description": "Agente especializado em atendimento ao cliente com foco em resolução rápida e eficiente de problemas.",
                        "benefits": [
                            "Atendimento 24/7 em múltiplos canais",
                            "Resolução rápida de problemas comuns",
                            "Escalação inteligente para humanos quando necessário"
                        ],
                        "compatibility": {
                            "channels": 100,
                            "languages": 100,
                            "integrations": 100
                        }
                    },
                    {
                        "id": "guilherme",
                        "name": "Guilherme",
                        "type": "sales",
                        "confidence": 92,
                        "description": "Agente de vendas e prospecção com abordagem amigável e persuasiva para maximizar conversões.",
                        "benefits": [
                            "Qualificação automática de leads",
                            "Acompanhamento personalizado do funil de vendas",
                            "Agendamento inteligente de reuniões com equipe comercial"
                        ],
                        "compatibility": {
                            "channels": 100,
                            "languages": 100,
                            "integrations": 100
                        }
                    }
                ],
                "status": "completed"
            }
        }

# Esquema para histórico de análises organizacionais
class OrganizationAnalysisHistoryResponse(BaseModel):
    """Esquema para histórico de análises organizacionais."""
    analysisId: int = Field(..., description="ID da análise")
    organizationName: str = Field(..., description="Nome da organização")
    createdAt: datetime = Field(..., description="Data de criação")
    status: str = Field(..., description="Status da análise")
    agentCount: int = Field(..., description="Número de agentes recomendados")
    
    class Config:
        schema_extra = {
            "example": {
                "analysisId": 1,
                "organizationName": "NowGo Holding",
                "createdAt": "2025-05-30T20:32:30.000Z",
                "status": "completed",
                "agentCount": 2
            }
        }
