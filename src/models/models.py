from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from src.config.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    domain = Column(String, nullable=False, unique=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    users = relationship("User", back_populates="client")
    organization_profile = relationship("OrganizationProfile", back_populates="client", uselist=False)
    agents = relationship("Agent", back_populates="client")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    client_id = Column(Integer, ForeignKey("clients.id"))
    is_admin = Column(Boolean, default=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    client = relationship("Client", back_populates="users")

class OrganizationProfile(Base):
    __tablename__ = "organization_profiles"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), unique=True)
    name = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    size = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    primary_language = Column(String, default="pt")
    supported_languages = Column(JSON, default=["pt", "en", "es"])
    communication_channels = Column(JSON, default=["whatsapp", "email", "phone", "linkedin"])
    crm_integration = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    client = relationship("Client", back_populates="organization_profile")
    analyses = relationship("OrganizationAnalysis", back_populates="organization_profile")
    generation_jobs = relationship("AgentGenerationJob", back_populates="organization_profile")

class OrganizationAnalysis(Base):
    __tablename__ = "organization_analyses"

    id = Column(Integer, primary_key=True, index=True)
    organization_profile_id = Column(Integer, ForeignKey("organization_profiles.id"))
    analysis_data = Column(JSON, nullable=False)
    recommended_agents = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    organization_profile = relationship("OrganizationProfile", back_populates="analyses")

class AgentTemplate(Base):
    __tablename__ = "agent_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    agent_type = Column(String, nullable=False)
    base_instructions = Column(Text, nullable=False)
    configuration = Column(JSON, nullable=False)
    applicable_industries = Column(JSON, nullable=False)
    applicable_departments = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    agent_type = Column(String, nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"))
    template_id = Column(Integer, ForeignKey("agent_templates.id"), nullable=True)
    configuration = Column(JSON, nullable=False)
    instructions = Column(Text, nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    client = relationship("Client", back_populates="agents")
    template = relationship("AgentTemplate")
    integrations = relationship("AgentChannelIntegration", back_populates="agent")

class AgentGenerationJob(Base):
    __tablename__ = "agent_generation_jobs"

    id = Column(Integer, primary_key=True, index=True)
    organization_profile_id = Column(Integer, ForeignKey("organization_profiles.id"))
    agent_templates = Column(JSON, nullable=False)
    status = Column(String, default="pending")
    generated_agents = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relacionamentos
    organization_profile = relationship("OrganizationProfile", back_populates="generation_jobs")

class ChannelIntegration(Base):
    __tablename__ = "channel_integrations"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    channel_type = Column(String, nullable=False)
    configuration = Column(JSON, nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    client = relationship("Client")

class AgentChannelIntegration(Base):
    __tablename__ = "agent_channel_integrations"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    channel_integration_id = Column(Integer, ForeignKey("channel_integrations.id"))
    configuration = Column(JSON, nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    agent = relationship("Agent", back_populates="integrations")
    channel_integration = relationship("ChannelIntegration")
