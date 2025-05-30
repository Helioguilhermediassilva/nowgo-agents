"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: NowGo Holding                                                       │
│ @file: schemas.py                                                            │
│ Developed by: NowGo Holding AI Team                                          │
│ Creation date: May 30, 2025                                                  │
│ Contact: ai@nowgo.holding                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © NowGo Holding 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
└──────────────────────────────────────────────────────────────────────────────┘
"""

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from src.models.organization_analyzer import IndustryType, CompanySize
import uuid

# Organization Profile Schemas
class OrganizationProfileBase(BaseModel):
    industry: IndustryType
    company_size: CompanySize
    has_sales_team: bool = True
    has_customer_service: bool = True
    has_marketing: bool = True
    has_hr: bool = True
    has_finance: bool = True
    has_operations: bool = True
    uses_whatsapp: bool = False
    uses_email: bool = True
    uses_phone: bool = True
    uses_linkedin: bool = False
    uses_instagram: bool = False
    uses_facebook: bool = False
    uses_twitter: bool = False
    uses_telegram: bool = False
    primary_language: str = "pt"
    secondary_languages: List[str] = []
    crm_system: Optional[str] = None
    erp_system: Optional[str] = None
    helpdesk_system: Optional[str] = None
    custom_fields: Dict[str, Any] = {}

class OrganizationProfileCreate(OrganizationProfileBase):
    pass

class OrganizationProfileUpdate(BaseModel):
    industry: Optional[IndustryType] = None
    company_size: Optional[CompanySize] = None
    has_sales_team: Optional[bool] = None
    has_customer_service: Optional[bool] = None
    has_marketing: Optional[bool] = None
    has_hr: Optional[bool] = None
    has_finance: Optional[bool] = None
    has_operations: Optional[bool] = None
    uses_whatsapp: Optional[bool] = None
    uses_email: Optional[bool] = None
    uses_phone: Optional[bool] = None
    uses_linkedin: Optional[bool] = None
    uses_instagram: Optional[bool] = None
    uses_facebook: Optional[bool] = None
    uses_twitter: Optional[bool] = None
    uses_telegram: Optional[bool] = None
    primary_language: Optional[str] = None
    secondary_languages: Optional[List[str]] = None
    crm_system: Optional[str] = None
    erp_system: Optional[str] = None
    helpdesk_system: Optional[str] = None
    custom_fields: Optional[Dict[str, Any]] = None

class OrganizationProfileResponse(OrganizationProfileBase):
    id: str
    client_id: str
    recommended_agents: List[Dict[str, Any]] = []
    analysis_complete: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Agent Template Schemas
class AgentTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    agent_type: str
    industry: Optional[IndustryType] = None
    department: Optional[str] = None
    base_instruction: str
    config_template: Dict[str, Any] = {}
    required_tools: List[str] = []
    customization_fields: List[str] = []

class AgentTemplateCreate(AgentTemplateBase):
    pass

class AgentTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    agent_type: Optional[str] = None
    industry: Optional[IndustryType] = None
    department: Optional[str] = None
    base_instruction: Optional[str] = None
    config_template: Optional[Dict[str, Any]] = None
    required_tools: Optional[List[str]] = None
    customization_fields: Optional[List[str]] = None
    is_active: Optional[bool] = None

class AgentTemplateResponse(AgentTemplateBase):
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Agent Generation Job Schemas
class AgentGenerationJobCreate(BaseModel):
    selected_templates: List[str]

class AgentGenerationJobResponse(BaseModel):
    id: str
    client_id: str
    organization_profile_id: str
    status: str
    progress: int
    error_message: Optional[str] = None
    selected_templates: List[str]
    generated_agents: List[str] = []
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True
