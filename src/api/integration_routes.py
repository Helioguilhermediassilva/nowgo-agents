"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: NowGo Holding                                                       │
│ @file: integration_routes.py                                                 │
│ Developed by: NowGo Holding AI Team                                          │
│ Creation date: May 30, 2025                                                  │
│ Contact: ai@nowgo.holding                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © NowGo Holding 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
└──────────────────────────────────────────────────────────────────────────────┘
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional

from src.config.database import get_db
from src.services.auth_service import get_current_user
from src.services.channel_integration import ChannelIntegration
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/integrations", tags=["Channel Integrations"])

# Schema models for request validation
class WhatsAppConfig(BaseModel):
    api_key: str
    phone_number_id: str
    webhook_url: str

class EmailConfig(BaseModel):
    smtp_server: str
    smtp_port: int
    username: str
    password: str
    from_email: str

class LinkedInConfig(BaseModel):
    client_id: str
    client_secret: str
    redirect_uri: str
    access_token: str

class PhoneConfig(BaseModel):
    provider: str
    api_key: str
    phone_numbers: List[str]

class CRMConfig(BaseModel):
    crm_type: str
    api_key: str
    base_url: str

class MessageRequest(BaseModel):
    channel: str
    recipient: str
    message: str
    metadata: Optional[Dict[str, Any]] = None

# Routes for channel integrations
@router.post("/whatsapp", response_model=Dict[str, Any])
async def setup_whatsapp(
    config: WhatsAppConfig,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Set up WhatsApp integration for the current client
    """
    if not current_user.client_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not associated with a client"
        )
    
    channel_integration = ChannelIntegration(db)
    result = await channel_integration.setup_whatsapp_integration(
        client_id=current_user.client_id,
        config=config.dict()
    )
    
    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to set up WhatsApp integration")
        )
    
    return result

@router.post("/email", response_model=Dict[str, Any])
async def setup_email(
    config: EmailConfig,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Set up Email integration for the current client
    """
    if not current_user.client_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not associated with a client"
        )
    
    channel_integration = ChannelIntegration(db)
    result = await channel_integration.setup_email_integration(
        client_id=current_user.client_id,
        config=config.dict()
    )
    
    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to set up Email integration")
        )
    
    return result

@router.post("/linkedin", response_model=Dict[str, Any])
async def setup_linkedin(
    config: LinkedInConfig,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Set up LinkedIn integration for the current client
    """
    if not current_user.client_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not associated with a client"
        )
    
    channel_integration = ChannelIntegration(db)
    result = await channel_integration.setup_linkedin_integration(
        client_id=current_user.client_id,
        config=config.dict()
    )
    
    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to set up LinkedIn integration")
        )
    
    return result

@router.post("/phone", response_model=Dict[str, Any])
async def setup_phone(
    config: PhoneConfig,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Set up Phone integration for the current client
    """
    if not current_user.client_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not associated with a client"
        )
    
    channel_integration = ChannelIntegration(db)
    result = await channel_integration.setup_phone_integration(
        client_id=current_user.client_id,
        config=config.dict()
    )
    
    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to set up Phone integration")
        )
    
    return result

@router.post("/crm", response_model=Dict[str, Any])
async def setup_crm(
    config: CRMConfig,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Set up CRM integration for the current client
    """
    if not current_user.client_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not associated with a client"
        )
    
    channel_integration = ChannelIntegration(db)
    result = await channel_integration.setup_crm_integration(
        client_id=current_user.client_id,
        config=config.dict()
    )
    
    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to set up CRM integration")
        )
    
    return result

@router.post("/send-message", response_model=Dict[str, Any])
async def send_message(
    message_request: MessageRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Send a message through a specific channel
    """
    if not current_user.client_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not associated with a client"
        )
    
    channel_integration = ChannelIntegration(db)
    result = await channel_integration.send_message(
        client_id=current_user.client_id,
        channel=message_request.channel,
        recipient=message_request.recipient,
        message=message_request.message,
        metadata=message_request.metadata
    )
    
    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", f"Failed to send message via {message_request.channel}")
        )
    
    return result
