"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: NowGo Holding                                                       │
│ @file: api_routes.py                                                         │
│ Developed by: NowGo Holding AI Team                                          │
│ Creation date: May 30, 2025                                                  │
│ Contact: ai@nowgo.holding                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © NowGo Holding 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
└──────────────────────────────────────────────────────────────────────────────┘
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from src.models.organization_analyzer import (
    OrganizationProfile,
    AgentTemplate,
    AgentGenerationJob,
    IndustryType,
    CompanySize
)
from src.services.agent_generator import AgentGenerator
from src.schemas.schemas import (
    OrganizationProfileCreate,
    OrganizationProfileUpdate,
    OrganizationProfileResponse,
    AgentTemplateCreate,
    AgentTemplateUpdate,
    AgentTemplateResponse,
    AgentGenerationJobCreate,
    AgentGenerationJobResponse
)
from src.config.database import get_db
from src.services.auth_service import get_current_user

router = APIRouter(prefix="/api/v1/organization", tags=["Organization Analysis"])

# Organization Profile Routes
@router.post("/profile", response_model=OrganizationProfileResponse)
async def create_organization_profile(
    profile: OrganizationProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new organization profile for analysis.
    """
    # Check if profile already exists for this client
    existing_profile = db.query(OrganizationProfile).filter(
        OrganizationProfile.client_id == current_user.client_id
    ).first()
    
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization profile already exists for this client"
        )
    
    # Create new profile
    new_profile = OrganizationProfile(
        client_id=current_user.client_id,
        industry=profile.industry,
        company_size=profile.company_size,
        has_sales_team=profile.has_sales_team,
        has_customer_service=profile.has_customer_service,
        has_marketing=profile.has_marketing,
        has_hr=profile.has_hr,
        has_finance=profile.has_finance,
        has_operations=profile.has_operations,
        uses_whatsapp=profile.uses_whatsapp,
        uses_email=profile.uses_email,
        uses_phone=profile.uses_phone,
        uses_linkedin=profile.uses_linkedin,
        uses_instagram=profile.uses_instagram,
        uses_facebook=profile.uses_facebook,
        uses_twitter=profile.uses_twitter,
        uses_telegram=profile.uses_telegram,
        primary_language=profile.primary_language,
        secondary_languages=profile.secondary_languages,
        crm_system=profile.crm_system,
        erp_system=profile.erp_system,
        helpdesk_system=profile.helpdesk_system,
        custom_fields=profile.custom_fields
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    return new_profile

@router.get("/profile", response_model=OrganizationProfileResponse)
async def get_organization_profile(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get the organization profile for the current client.
    """
    profile = db.query(OrganizationProfile).filter(
        OrganizationProfile.client_id == current_user.client_id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization profile not found"
        )
    
    return profile

@router.put("/profile", response_model=OrganizationProfileResponse)
async def update_organization_profile(
    profile_update: OrganizationProfileUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update the organization profile for the current client.
    """
    profile = db.query(OrganizationProfile).filter(
        OrganizationProfile.client_id == current_user.client_id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization profile not found"
        )
    
    # Update profile fields
    for key, value in profile_update.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    # Reset analysis results if profile is updated
    profile.analysis_complete = False
    profile.recommended_agents = []
    
    db.commit()
    db.refresh(profile)
    
    return profile

@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_organization(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Analyze the organization profile and recommend agent templates.
    """
    profile = db.query(OrganizationProfile).filter(
        OrganizationProfile.client_id == current_user.client_id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization profile not found"
        )
    
    # Create agent generator
    agent_generator = AgentGenerator(db)
    
    # Run analysis in background
    background_tasks.add_task(
        agent_generator.analyze_organization,
        organization_profile_id=profile.id
    )
    
    return {
        "message": "Analysis started",
        "organization_profile_id": str(profile.id),
        "status": "in_progress"
    }

@router.get("/analysis-results", response_model=Dict[str, Any])
async def get_analysis_results(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get the results of the organization analysis.
    """
    profile = db.query(OrganizationProfile).filter(
        OrganizationProfile.client_id == current_user.client_id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization profile not found"
        )
    
    if not profile.analysis_complete:
        return {
            "message": "Analysis not complete",
            "organization_profile_id": str(profile.id),
            "status": "in_progress",
            "recommended_agents": []
        }
    
    return {
        "message": "Analysis complete",
        "organization_profile_id": str(profile.id),
        "status": "complete",
        "recommended_agents": profile.recommended_agents,
        "agent_count": len(profile.recommended_agents)
    }

# Agent Generation Routes
@router.post("/generate-agents", response_model=Dict[str, Any])
async def create_agent_generation_job(
    job_create: AgentGenerationJobCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a job to generate agents based on selected templates.
    """
    profile = db.query(OrganizationProfile).filter(
        OrganizationProfile.client_id == current_user.client_id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization profile not found"
        )
    
    # Create agent generator
    agent_generator = AgentGenerator(db)
    
    # Create generation job
    job_result = await agent_generator.create_generation_job(
        client_id=current_user.client_id,
        organization_profile_id=profile.id,
        selected_template_ids=job_create.selected_templates
    )
    
    if "error" in job_result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=job_result["error"]
        )
    
    # Process job in background
    background_tasks.add_task(
        agent_generator.process_generation_job,
        job_id=job_result["job_id"]
    )
    
    return {
        "message": "Agent generation started",
        "job_id": job_result["job_id"],
        "status": "pending",
        "template_count": job_result["template_count"]
    }

@router.get("/generation-job/{job_id}", response_model=Dict[str, Any])
async def get_generation_job_status(
    job_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get the status of an agent generation job.
    """
    job = db.query(AgentGenerationJob).filter(
        AgentGenerationJob.id == job_id,
        AgentGenerationJob.client_id == current_user.client_id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    result = {
        "job_id": str(job.id),
        "status": job.status,
        "progress": job.progress,
        "created_at": job.created_at.isoformat() if job.created_at else None,
        "completed_at": job.completed_at.isoformat() if job.completed_at else None
    }
    
    if job.status == "completed":
        result["generated_agents"] = job.generated_agents
        result["agent_count"] = len(job.generated_agents)
    
    if job.status == "failed":
        result["error"] = job.error_message
    
    return result

@router.get("/generation-jobs", response_model=List[Dict[str, Any]])
async def list_generation_jobs(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List all agent generation jobs for the current client.
    """
    jobs = db.query(AgentGenerationJob).filter(
        AgentGenerationJob.client_id == current_user.client_id
    ).all()
    
    result = []
    for job in jobs:
        job_data = {
            "job_id": str(job.id),
            "status": job.status,
            "progress": job.progress,
            "created_at": job.created_at.isoformat() if job.created_at else None,
            "completed_at": job.completed_at.isoformat() if job.completed_at else None
        }
        
        if job.status == "completed":
            job_data["generated_agents"] = job.generated_agents
            job_data["agent_count"] = len(job.generated_agents)
        
        if job.status == "failed":
            job_data["error"] = job.error_message
        
        result.append(job_data)
    
    return result
