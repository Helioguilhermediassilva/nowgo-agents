"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ Rotas de API para Geração e Validação de Agentes                            │
│                                                                             │
│ Este arquivo implementa as rotas de API para geração automática de agentes  │
│ e validação pelo usuário final.                                             │
└─────────────────────────────────────────────────────────────────────────────┘
"""

from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.models.models import Agent, AgentConfiguration, Organization, OrganizationAnalysis
from src.services.agent_generator import AgentGenerator
from src.config.database import get_db
from src.services.auth_service import get_current_user

# Esquemas para validação de dados
class AgentGenerationRequest(BaseModel):
    """Esquema para solicitação de geração de agentes."""
    analysisId: int
    
    class Config:
        schema_extra = {
            "example": {
                "analysisId": 1
            }
        }

class AgentValidationRequest(BaseModel):
    """Esquema para validação de agentes pelo usuário."""
    agentId: int
    approved: bool
    feedback: Optional[str] = None
    modifications: Optional[Dict[str, Any]] = None
    
    class Config:
        schema_extra = {
            "example": {
                "agentId": 1,
                "approved": True,
                "feedback": "O agente atende perfeitamente às necessidades da empresa.",
                "modifications": {
                    "name": "Virginia Personalizada",
                    "prompt": "Prompt personalizado para o agente..."
                }
            }
        }

class AgentResponse(BaseModel):
    """Esquema para resposta com dados do agente."""
    id: int
    name: str
    type: str
    description: str
    configuration: Dict[str, Any]
    
    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "name": "Virginia",
                "type": "customer_support",
                "description": "Agente especializado em atendimento ao cliente",
                "configuration": {
                    "model": "gpt-4",
                    "prompt": "Você é Virginia, uma assistente virtual...",
                    "channels": {
                        "whatsapp": {"enabled": True},
                        "email": {"enabled": True}
                    }
                }
            }
        }

# Criação do router para geração e validação de agentes
router = APIRouter(
    prefix="/api/agents",
    tags=["agents"],
    responses={404: {"description": "Not found"}},
)

# Endpoint para gerar agentes a partir de uma análise
@router.post("/generate", response_model=List[AgentResponse])
async def generate_agents(
    request: AgentGenerationRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Gera agentes personalizados com base nos resultados de uma análise organizacional.
    
    Esta função:
    1. Recebe o ID de uma análise organizacional
    2. Utiliza o serviço AgentGenerator para criar agentes personalizados
    3. Retorna a lista de agentes gerados com suas configurações
    """
    try:
        # Verificar se a análise existe e pertence ao tenant do usuário
        analysis = db.query(OrganizationAnalysis).filter(
            OrganizationAnalysis.id == request.analysisId,
            OrganizationAnalysis.tenant_id == current_user.tenant_id
        ).first()
        
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Análise não encontrada"
            )
        
        # Criar instância do gerador de agentes
        agent_generator = AgentGenerator(db_session=db)
        
        # Gerar agentes com base na análise
        generated_agents = agent_generator.generate_agents_from_analysis(
            analysis_id=request.analysisId,
            tenant_id=current_user.tenant_id,
            user_id=current_user.id
        )
        
        return generated_agents
    
    except Exception as e:
        # Registrar o erro e retornar uma resposta de erro
        print(f"Erro na geração de agentes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao gerar agentes: {str(e)}"
        )

# Endpoint para validar um agente gerado
@router.post("/validate", response_model=AgentResponse)
async def validate_agent(
    request: AgentValidationRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Valida um agente gerado, aplicando modificações se necessário.
    
    Esta função:
    1. Recebe o ID do agente e informações de validação
    2. Atualiza o status de aprovação do agente
    3. Aplica modificações solicitadas pelo usuário
    4. Retorna o agente atualizado
    """
    try:
        # Verificar se o agente existe e pertence ao tenant do usuário
        agent = db.query(Agent).filter(
            Agent.id == request.agentId,
            Agent.tenant_id == current_user.tenant_id
        ).first()
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agente não encontrado"
            )
        
        # Obter configuração ativa do agente
        agent_config = db.query(AgentConfiguration).filter(
            AgentConfiguration.agent_id == agent.id,
            AgentConfiguration.is_active == True
        ).first()
        
        if not agent_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Configuração do agente não encontrada"
            )
        
        # Atualizar status de aprovação do agente
        agent.is_approved = request.approved
        agent.approval_feedback = request.feedback
        
        # Aplicar modificações se fornecidas e aprovadas
        if request.approved and request.modifications:
            # Criar nova versão da configuração
            new_config = agent_config.configuration.copy()
            
            # Aplicar modificações
            if "name" in request.modifications:
                agent.name = request.modifications["name"]
                new_config["name"] = request.modifications["name"]
            
            if "description" in request.modifications:
                agent.description = request.modifications["description"]
                new_config["description"] = request.modifications["description"]
            
            # Atualizar outros campos da configuração
            for key, value in request.modifications.items():
                if key not in ["name", "description"]:
                    new_config[key] = value
            
            # Desativar configuração atual
            agent_config.is_active = False
            
            # Criar nova configuração
            new_agent_config = AgentConfiguration(
                agent_id=agent.id,
                configuration=new_config,
                version=agent_config.version + 1,
                is_active=True
            )
            db.add(new_agent_config)
            
            # Atualizar referência para retorno
            agent_config = new_agent_config
        
        # Persistir mudanças
        db.commit()
        db.refresh(agent)
        
        if hasattr(agent_config, 'id'):
            db.refresh(agent_config)
        
        # Retornar agente atualizado
        return {
            "id": agent.id,
            "name": agent.name,
            "type": agent.type,
            "description": agent.description,
            "configuration": agent_config.configuration
        }
    
    except Exception as e:
        # Registrar o erro e retornar uma resposta de erro
        print(f"Erro na validação do agente: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao validar agente: {str(e)}"
        )

# Endpoint para listar agentes do usuário
@router.get("/list", response_model=List[AgentResponse])
async def list_agents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Lista todos os agentes do tenant do usuário.
    """
    try:
        # Buscar agentes do tenant
        agents = db.query(Agent).filter(
            Agent.tenant_id == current_user.tenant_id
        ).all()
        
        result = []
        for agent in agents:
            # Obter configuração ativa
            agent_config = db.query(AgentConfiguration).filter(
                AgentConfiguration.agent_id == agent.id,
                AgentConfiguration.is_active == True
            ).first()
            
            if agent_config:
                result.append({
                    "id": agent.id,
                    "name": agent.name,
                    "type": agent.type,
                    "description": agent.description,
                    "configuration": agent_config.configuration
                })
        
        return result
    
    except Exception as e:
        # Registrar o erro e retornar uma resposta de erro
        print(f"Erro ao listar agentes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao listar agentes: {str(e)}"
        )

# Endpoint para obter detalhes de um agente específico
@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Obtém detalhes de um agente específico.
    """
    try:
        # Verificar se o agente existe e pertence ao tenant do usuário
        agent = db.query(Agent).filter(
            Agent.id == agent_id,
            Agent.tenant_id == current_user.tenant_id
        ).first()
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agente não encontrado"
            )
        
        # Obter configuração ativa do agente
        agent_config = db.query(AgentConfiguration).filter(
            AgentConfiguration.agent_id == agent.id,
            AgentConfiguration.is_active == True
        ).first()
        
        if not agent_config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Configuração do agente não encontrada"
            )
        
        return {
            "id": agent.id,
            "name": agent.name,
            "type": agent.type,
            "description": agent.description,
            "configuration": agent_config.configuration
        }
    
    except Exception as e:
        # Registrar o erro e retornar uma resposta de erro
        print(f"Erro ao obter agente: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter agente: {str(e)}"
        )
