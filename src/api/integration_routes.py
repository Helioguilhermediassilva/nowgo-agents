"""
Rotas de API para integrações com canais de comunicação
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from src.config.database import get_db

router = APIRouter()

@router.post("/channels/", status_code=status.HTTP_201_CREATED)
def create_channel_integration(
    client_id: int,
    channel_type: str,
    configuration: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Cria uma nova integração de canal de comunicação.
    """
    from src.models.models import ChannelIntegration
    
    # Criar nova integração
    integration = ChannelIntegration(
        client_id=client_id,
        channel_type=channel_type,
        configuration=configuration
    )
    
    db.add(integration)
    db.commit()
    db.refresh(integration)
    
    return {
        "message": "Integração de canal criada com sucesso",
        "integration_id": integration.id
    }

@router.get("/channels/client/{client_id}", response_model=List[Dict[str, Any]])
def get_client_integrations(
    client_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtém todas as integrações de canais para um cliente.
    """
    from src.models.models import ChannelIntegration
    
    integrations = db.query(ChannelIntegration).filter(
        ChannelIntegration.client_id == client_id
    ).all()
    
    result = []
    for integration in integrations:
        result.append({
            "id": integration.id,
            "client_id": integration.client_id,
            "channel_type": integration.channel_type,
            "configuration": integration.configuration,
            "active": integration.active,
            "created_at": integration.created_at,
            "updated_at": integration.updated_at
        })
    
    return result

@router.post("/agents/{agent_id}/channels/{channel_id}", status_code=status.HTTP_201_CREATED)
def link_agent_to_channel(
    agent_id: int,
    channel_id: int,
    configuration: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Vincula um agente a um canal de comunicação.
    """
    from src.models.models import Agent, ChannelIntegration, AgentChannelIntegration
    
    # Verificar se o agente existe
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agente não encontrado"
        )
    
    # Verificar se o canal existe
    channel = db.query(ChannelIntegration).filter(ChannelIntegration.id == channel_id).first()
    if not channel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Canal de integração não encontrado"
        )
    
    # Verificar se já existe vínculo
    existing_link = db.query(AgentChannelIntegration).filter(
        AgentChannelIntegration.agent_id == agent_id,
        AgentChannelIntegration.channel_integration_id == channel_id
    ).first()
    
    if existing_link:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agente já está vinculado a este canal"
        )
    
    # Criar vínculo
    link = AgentChannelIntegration(
        agent_id=agent_id,
        channel_integration_id=channel_id,
        configuration=configuration
    )
    
    db.add(link)
    db.commit()
    db.refresh(link)
    
    return {
        "message": "Agente vinculado ao canal com sucesso",
        "link_id": link.id
    }

@router.get("/agents/{agent_id}/channels", response_model=List[Dict[str, Any]])
def get_agent_channels(
    agent_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtém todos os canais vinculados a um agente.
    """
    from src.models.models import AgentChannelIntegration, ChannelIntegration
    
    # Buscar vínculos do agente
    links = db.query(AgentChannelIntegration).filter(
        AgentChannelIntegration.agent_id == agent_id
    ).all()
    
    result = []
    for link in links:
        # Buscar informações do canal
        channel = db.query(ChannelIntegration).filter(
            ChannelIntegration.id == link.channel_integration_id
        ).first()
        
        if channel:
            result.append({
                "link_id": link.id,
                "channel_id": channel.id,
                "channel_type": channel.channel_type,
                "configuration": link.configuration,
                "active": link.active,
                "created_at": link.created_at,
                "updated_at": link.updated_at
            })
    
    return result
