"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: NowGo Holding                                                       │
│ @file: organization_analyzer.py                                              │
│ Developed by: NowGo Holding AI Team                                          │
│ Creation date: May 30, 2025                                                  │
│ Contact: ai@nowgo.holding                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © NowGo Holding 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
└──────────────────────────────────────────────────────────────────────────────┘
"""

from sqlalchemy import (
    Column,
    String,
    UUID,
    DateTime,
    ForeignKey,
    JSON,
    Text,
    Integer,
    Boolean,
    Enum,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, backref
from src.config.database import Base
import uuid
import enum


class IndustryType(str, enum.Enum):
    TECHNOLOGY = "technology"
    FINANCE = "finance"
    HEALTHCARE = "healthcare"
    RETAIL = "retail"
    MANUFACTURING = "manufacturing"
    EDUCATION = "education"
    REAL_ESTATE = "real_estate"
    HOSPITALITY = "hospitality"
    TRANSPORTATION = "transportation"
    ENERGY = "energy"
    AGRICULTURE = "agriculture"
    ENTERTAINMENT = "entertainment"
    LEGAL = "legal"
    CONSULTING = "consulting"
    OTHER = "other"


class CompanySize(str, enum.Enum):
    SMALL = "small"  # 1-50 employees
    MEDIUM = "medium"  # 51-500 employees
    LARGE = "large"  # 501-5000 employees
    ENTERPRISE = "enterprise"  # 5000+ employees


class OrganizationProfile(Base):
    """
    Stores the organization profile information used for agent recommendation
    and automatic generation.
    """
    __tablename__ = "organization_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id", ondelete="CASCADE"))
    
    # Basic information
    industry = Column(Enum(IndustryType), nullable=False)
    company_size = Column(Enum(CompanySize), nullable=False)
    
    # Business focus
    has_sales_team = Column(Boolean, default=True)
    has_customer_service = Column(Boolean, default=True)
    has_marketing = Column(Boolean, default=True)
    has_hr = Column(Boolean, default=True)
    has_finance = Column(Boolean, default=True)
    has_operations = Column(Boolean, default=True)
    
    # Communication channels
    uses_whatsapp = Column(Boolean, default=False)
    uses_email = Column(Boolean, default=True)
    uses_phone = Column(Boolean, default=True)
    uses_linkedin = Column(Boolean, default=False)
    uses_instagram = Column(Boolean, default=False)
    uses_facebook = Column(Boolean, default=False)
    uses_twitter = Column(Boolean, default=False)
    uses_telegram = Column(Boolean, default=False)
    
    # Languages
    primary_language = Column(String, default="pt")
    secondary_languages = Column(JSON, default=list)
    
    # Integration preferences
    crm_system = Column(String, nullable=True)
    erp_system = Column(String, nullable=True)
    helpdesk_system = Column(String, nullable=True)
    
    # Custom fields for specific industry needs
    custom_fields = Column(JSON, default=dict)
    
    # Analysis results
    recommended_agents = Column(JSON, default=list)
    analysis_complete = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    client = relationship("Client", backref="organization_profile")
    
    def to_dict(self):
        """Converts the object to a dictionary, converting UUIDs to strings"""
        result = {}
        for key, value in self.__dict__.items():
            if key.startswith("_"):
                continue
            if isinstance(value, uuid.UUID):
                result[key] = str(value)
            elif isinstance(value, enum.Enum):
                result[key] = value.value
            elif isinstance(value, dict):
                result[key] = value
            elif isinstance(value, list):
                result[key] = value
            else:
                result[key] = value
        return result


class AgentTemplate(Base):
    """
    Predefined agent templates for different industries and use cases.
    These templates are used to automatically generate agents based on
    organization profiles.
    """
    __tablename__ = "agent_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Template metadata
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    agent_type = Column(String, nullable=False)
    industry = Column(Enum(IndustryType), nullable=True)  # Null means applicable to all industries
    department = Column(String, nullable=True)  # e.g., "sales", "customer_service", etc.
    
    # Template configuration
    base_instruction = Column(Text, nullable=False)
    config_template = Column(JSON, default={})
    required_tools = Column(JSON, default=list)
    
    # Customization points
    customization_fields = Column(JSON, default=list)  # List of fields that should be customized
    
    # Metadata
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        """Converts the object to a dictionary, converting UUIDs to strings"""
        result = {}
        for key, value in self.__dict__.items():
            if key.startswith("_"):
                continue
            if isinstance(value, uuid.UUID):
                result[key] = str(value)
            elif isinstance(value, enum.Enum):
                result[key] = value.value
            elif isinstance(value, dict):
                result[key] = value
            elif isinstance(value, list):
                result[key] = value
            else:
                result[key] = value
        return result


class AgentGenerationJob(Base):
    """
    Tracks the status of agent generation jobs.
    """
    __tablename__ = "agent_generation_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id", ondelete="CASCADE"))
    
    # Job metadata
    status = Column(String, default="pending")  # pending, in_progress, completed, failed
    progress = Column(Integer, default=0)  # 0-100
    error_message = Column(Text, nullable=True)
    
    # Job configuration
    organization_profile_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("organization_profiles.id", ondelete="CASCADE")
    )
    selected_templates = Column(JSON, default=list)  # List of template IDs to generate
    
    # Results
    generated_agents = Column(JSON, default=list)  # List of generated agent IDs
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    client = relationship("Client", backref="agent_generation_jobs")
    organization_profile = relationship("OrganizationProfile", backref="generation_jobs")
    
    def to_dict(self):
        """Converts the object to a dictionary, converting UUIDs to strings"""
        result = {}
        for key, value in self.__dict__.items():
            if key.startswith("_"):
                continue
            if isinstance(value, uuid.UUID):
                result[key] = str(value)
            elif isinstance(value, dict):
                result[key] = value
            elif isinstance(value, list):
                result[key] = value
            else:
                result[key] = value
        return result
