"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: NowGo Holding                                                       │
│ @file: agent_generator.py                                                    │
│ Developed by: NowGo Holding AI Team                                          │
│ Creation date: May 30, 2025                                                  │
│ Contact: ai@nowgo.holding                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © NowGo Holding 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
└──────────────────────────────────────────────────────────────────────────────┘
"""

from sqlalchemy.orm import Session
from src.models.models import Agent, AgentFolder, Client
from src.models.organization_analyzer import (
    OrganizationProfile, 
    AgentTemplate, 
    AgentGenerationJob,
    IndustryType,
    CompanySize
)
from typing import List, Dict, Any, Optional, Union
import uuid
import logging
import json
import asyncio
from datetime import datetime

logger = logging.getLogger(__name__)

class AgentGenerator:
    """
    Responsible for analyzing organization profiles and automatically
    generating appropriate agents based on templates and business needs.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    async def analyze_organization(self, organization_profile_id: Union[uuid.UUID, str]) -> Dict[str, Any]:
        """
        Analyzes an organization profile and recommends appropriate agent templates.
        
        Args:
            organization_profile_id: UUID of the organization profile to analyze
            
        Returns:
            Dictionary with analysis results including recommended agent templates
        """
        # Convert string ID to UUID if needed
        if isinstance(organization_profile_id, str):
            organization_profile_id = uuid.UUID(organization_profile_id)
            
        # Get the organization profile
        profile = self.db.query(OrganizationProfile).filter(
            OrganizationProfile.id == organization_profile_id
        ).first()
        
        if not profile:
            logger.error(f"Organization profile not found: {organization_profile_id}")
            return {"error": "Organization profile not found"}
        
        # Get all active templates
        templates = self.db.query(AgentTemplate).filter(
            AgentTemplate.is_active == True
        ).all()
        
        # Filter templates based on industry match or null industry (applicable to all)
        matching_templates = []
        for template in templates:
            if template.industry is None or template.industry == profile.industry:
                matching_templates.append(template)
        
        # Further filter based on department needs
        recommended_templates = []
        
        # Check sales department
        if profile.has_sales_team:
            sales_templates = [t for t in matching_templates if t.department == "sales"]
            recommended_templates.extend(sales_templates)
            
        # Check customer service department
        if profile.has_customer_service:
            cs_templates = [t for t in matching_templates if t.department == "customer_service"]
            recommended_templates.extend(cs_templates)
            
        # Check marketing department
        if profile.has_marketing:
            marketing_templates = [t for t in matching_templates if t.department == "marketing"]
            recommended_templates.extend(marketing_templates)
            
        # Check HR department
        if profile.has_hr:
            hr_templates = [t for t in matching_templates if t.department == "hr"]
            recommended_templates.extend(hr_templates)
            
        # Check finance department
        if profile.has_finance:
            finance_templates = [t for t in matching_templates if t.department == "finance"]
            recommended_templates.extend(finance_templates)
            
        # Check operations department
        if profile.has_operations:
            operations_templates = [t for t in matching_templates if t.department == "operations"]
            recommended_templates.extend(operations_templates)
        
        # Convert templates to dictionary format
        recommended_template_dicts = [template.to_dict() for template in recommended_templates]
        
        # Update the organization profile with recommendations
        profile.recommended_agents = recommended_template_dicts
        profile.analysis_complete = True
        profile.updated_at = datetime.now()
        
        self.db.commit()
        
        return {
            "organization_id": str(profile.id),
            "analysis_complete": True,
            "recommended_templates": recommended_template_dicts,
            "template_count": len(recommended_template_dicts)
        }
    
    async def create_generation_job(
        self, 
        client_id: Union[uuid.UUID, str],
        organization_profile_id: Union[uuid.UUID, str],
        selected_template_ids: List[Union[uuid.UUID, str]]
    ) -> Dict[str, Any]:
        """
        Creates a new agent generation job.
        
        Args:
            client_id: UUID of the client
            organization_profile_id: UUID of the organization profile
            selected_template_ids: List of template IDs to generate agents from
            
        Returns:
            Dictionary with job details
        """
        # Convert string IDs to UUIDs if needed
        if isinstance(client_id, str):
            client_id = uuid.UUID(client_id)
            
        if isinstance(organization_profile_id, str):
            organization_profile_id = uuid.UUID(organization_profile_id)
            
        # Validate client exists
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            logger.error(f"Client not found: {client_id}")
            return {"error": "Client not found"}
        
        # Validate organization profile exists
        profile = self.db.query(OrganizationProfile).filter(
            OrganizationProfile.id == organization_profile_id,
            OrganizationProfile.client_id == client_id
        ).first()
        
        if not profile:
            logger.error(f"Organization profile not found: {organization_profile_id}")
            return {"error": "Organization profile not found"}
        
        # Validate templates exist
        template_ids = []
        for template_id in selected_template_ids:
            if isinstance(template_id, str):
                template_id = uuid.UUID(template_id)
            template_ids.append(template_id)
            
            template = self.db.query(AgentTemplate).filter(
                AgentTemplate.id == template_id,
                AgentTemplate.is_active == True
            ).first()
            
            if not template:
                logger.error(f"Template not found or inactive: {template_id}")
                return {"error": f"Template not found or inactive: {template_id}"}
        
        # Create the job
        job = AgentGenerationJob(
            client_id=client_id,
            organization_profile_id=organization_profile_id,
            selected_templates=[str(tid) for tid in template_ids],
            status="pending",
            progress=0
        )
        
        self.db.add(job)
        self.db.commit()
        
        # Return job details
        return {
            "job_id": str(job.id),
            "status": job.status,
            "template_count": len(template_ids),
            "created_at": job.created_at.isoformat() if job.created_at else None
        }
    
    async def process_generation_job(self, job_id: Union[uuid.UUID, str]) -> Dict[str, Any]:
        """
        Processes an agent generation job, creating agents based on templates.
        
        Args:
            job_id: UUID of the job to process
            
        Returns:
            Dictionary with job results
        """
        # Convert string ID to UUID if needed
        if isinstance(job_id, str):
            job_id = uuid.UUID(job_id)
            
        # Get the job
        job = self.db.query(AgentGenerationJob).filter(
            AgentGenerationJob.id == job_id
        ).first()
        
        if not job:
            logger.error(f"Job not found: {job_id}")
            return {"error": "Job not found"}
        
        # Update job status
        job.status = "in_progress"
        job.progress = 10
        self.db.commit()
        
        try:
            # Get the organization profile
            profile = self.db.query(OrganizationProfile).filter(
                OrganizationProfile.id == job.organization_profile_id
            ).first()
            
            if not profile:
                raise ValueError(f"Organization profile not found: {job.organization_profile_id}")
            
            # Get the client
            client = self.db.query(Client).filter(
                Client.id == job.client_id
            ).first()
            
            if not client:
                raise ValueError(f"Client not found: {job.client_id}")
            
            # Create a folder for the generated agents
            folder_name = f"{client.name} - Auto-generated Agents"
            folder = self.db.query(AgentFolder).filter(
                AgentFolder.client_id == job.client_id,
                AgentFolder.name == folder_name
            ).first()
            
            if not folder:
                folder = AgentFolder(
                    client_id=job.client_id,
                    name=folder_name,
                    description="Automatically generated agents based on organization profile"
                )
                self.db.add(folder)
                self.db.commit()
            
            # Update progress
            job.progress = 20
            self.db.commit()
            
            # Process each template
            generated_agent_ids = []
            template_count = len(job.selected_templates)
            
            for i, template_id_str in enumerate(job.selected_templates):
                template_id = uuid.UUID(template_id_str)
                
                # Get the template
                template = self.db.query(AgentTemplate).filter(
                    AgentTemplate.id == template_id
                ).first()
                
                if not template:
                    logger.warning(f"Template not found: {template_id}")
                    continue
                
                # Generate the agent
                agent_id = await self._generate_agent_from_template(
                    client_id=job.client_id,
                    folder_id=folder.id,
                    template=template,
                    profile=profile
                )
                
                if agent_id:
                    generated_agent_ids.append(str(agent_id))
                
                # Update progress
                progress_increment = 70 / template_count
                job.progress = 20 + int((i + 1) * progress_increment)
                self.db.commit()
            
            # Update job status
            job.status = "completed"
            job.progress = 100
            job.generated_agents = generated_agent_ids
            job.completed_at = datetime.now()
            self.db.commit()
            
            return {
                "job_id": str(job.id),
                "status": job.status,
                "generated_agents": generated_agent_ids,
                "agent_count": len(generated_agent_ids),
                "completed_at": job.completed_at.isoformat() if job.completed_at else None
            }
            
        except Exception as e:
            logger.error(f"Error processing job {job_id}: {str(e)}")
            
            # Update job status
            job.status = "failed"
            job.error_message = str(e)
            self.db.commit()
            
            return {
                "job_id": str(job.id),
                "status": job.status,
                "error": str(e)
            }
    
    async def _generate_agent_from_template(
        self,
        client_id: uuid.UUID,
        folder_id: uuid.UUID,
        template: AgentTemplate,
        profile: OrganizationProfile
    ) -> Optional[uuid.UUID]:
        """
        Generates an agent from a template, customized for the organization profile.
        
        Args:
            client_id: UUID of the client
            folder_id: UUID of the folder to place the agent in
            template: The agent template to use
            profile: The organization profile to customize for
            
        Returns:
            UUID of the generated agent, or None if generation failed
        """
        try:
            # Customize the instruction based on organization profile
            instruction = template.base_instruction
            
            # Replace placeholders in the instruction
            instruction = instruction.replace("{INDUSTRY}", profile.industry.value)
            instruction = instruction.replace("{COMPANY_SIZE}", profile.company_size.value)
            instruction = instruction.replace("{PRIMARY_LANGUAGE}", profile.primary_language)
            
            if profile.crm_system:
                instruction = instruction.replace("{CRM_SYSTEM}", profile.crm_system)
            else:
                instruction = instruction.replace("{CRM_SYSTEM}", "generic CRM")
                
            # Customize config based on organization profile
            config = template.config_template.copy()
            
            # Add communication channels
            channels = []
            if profile.uses_whatsapp:
                channels.append("whatsapp")
            if profile.uses_email:
                channels.append("email")
            if profile.uses_phone:
                channels.append("phone")
            if profile.uses_linkedin:
                channels.append("linkedin")
            if profile.uses_instagram:
                channels.append("instagram")
            if profile.uses_facebook:
                channels.append("facebook")
            if profile.uses_twitter:
                channels.append("twitter")
            if profile.uses_telegram:
                channels.append("telegram")
                
            if "channels" not in config:
                config["channels"] = {}
            
            config["channels"]["enabled"] = channels
            
            # Add languages
            languages = [profile.primary_language]
            if profile.secondary_languages:
                languages.extend(profile.secondary_languages)
                
            if "languages" not in config:
                config["languages"] = {}
                
            config["languages"]["primary"] = profile.primary_language
            config["languages"]["supported"] = languages
            
            # Create the agent
            agent_name = f"{template.name} - {profile.industry.value.capitalize()}"
            
            agent = Agent(
                client_id=client_id,
                name=agent_name,
                role=template.department.capitalize() if template.department else "Assistant",
                description=template.description,
                type=template.agent_type,
                instruction=instruction,
                folder_id=folder_id,
                config=config
            )
            
            self.db.add(agent)
            self.db.commit()
            
            return agent.id
            
        except Exception as e:
            logger.error(f"Error generating agent from template: {str(e)}")
            return None
