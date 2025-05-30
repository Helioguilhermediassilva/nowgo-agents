"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ Serviço de Integração para Análise Organizacional                           │
│                                                                             │
│ Este serviço implementa a integração entre o frontend e o backend para      │
│ análise organizacional, permitindo a coleta, processamento e apresentação   │
│ dos dados necessários para a geração automática de agentes.                 │
└─────────────────────────────────────────────────────────────────────────────┘
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.models.models import Organization, OrganizationAnalysis
from src.models.organization_analyzer import OrganizationAnalyzer
from src.schemas.organization_schemas import (
    OrganizationAnalysisCreate,
    OrganizationAnalysisResponse,
    OrganizationAnalysisHistoryResponse
)
from src.config.database import get_db
from src.services.auth_service import get_current_user

# Criação do router para análise organizacional
router = APIRouter(
    prefix="/api/organization",
    tags=["organization"],
    responses={404: {"description": "Not found"}},
)

# Endpoint para enviar dados de análise organizacional
@router.post("/analyze", response_model=OrganizationAnalysisResponse)
async def analyze_organization(
    data: OrganizationAnalysisCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Analisa os dados organizacionais e retorna recomendações de agentes.
    
    Esta função:
    1. Recebe os dados organizacionais do frontend
    2. Processa os dados usando o analisador organizacional
    3. Gera recomendações de agentes com base na análise
    4. Salva os resultados no banco de dados
    5. Retorna o ID da análise e um resumo dos resultados
    """
    try:
        # Verificar se a organização existe ou criar uma nova
        organization = db.query(Organization).filter(
            Organization.name == data.name,
            Organization.tenant_id == current_user.tenant_id
        ).first()
        
        if not organization:
            organization = Organization(
                name=data.name,
                industry=data.industry,
                size=data.size,
                description=data.description,
                tenant_id=current_user.tenant_id
            )
            db.add(organization)
            db.commit()
            db.refresh(organization)
        
        # Criar o analisador organizacional
        analyzer = OrganizationAnalyzer()
        
        # Processar a análise
        analysis_results = analyzer.analyze(
            organization_data=data.dict(),
            tenant_id=current_user.tenant_id
        )
        
        # Salvar os resultados da análise
        analysis = OrganizationAnalysis(
            organization_id=organization.id,
            tenant_id=current_user.tenant_id,
            user_id=current_user.id,
            results=analysis_results,
            status="completed"
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        # Retornar o ID da análise e um resumo dos resultados
        return {
            "analysisId": analysis.id,
            "organizationName": organization.name,
            "summary": analysis_results.get("summary", {}),
            "recommendedAgents": analysis_results.get("recommendedAgents", []),
            "status": "completed"
        }
    
    except Exception as e:
        # Registrar o erro e retornar uma resposta de erro
        print(f"Erro na análise organizacional: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar análise organizacional: {str(e)}"
        )

# Endpoint para obter resultados de análise por ID
@router.get("/analysis/{analysis_id}", response_model=OrganizationAnalysisResponse)
async def get_analysis_results(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Obtém os resultados de uma análise organizacional específica.
    """
    analysis = db.query(OrganizationAnalysis).filter(
        OrganizationAnalysis.id == analysis_id,
        OrganizationAnalysis.tenant_id == current_user.tenant_id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Análise não encontrada"
        )
    
    organization = db.query(Organization).filter(
        Organization.id == analysis.organization_id
    ).first()
    
    return {
        "analysisId": analysis.id,
        "organizationName": organization.name if organization else "Desconhecida",
        "summary": analysis.results.get("summary", {}),
        "recommendedAgents": analysis.results.get("recommendedAgents", []),
        "status": analysis.status
    }

# Endpoint para obter histórico de análises
@router.get("/analysis/history", response_model=List[OrganizationAnalysisHistoryResponse])
async def get_analysis_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Obtém o histórico de análises organizacionais do usuário atual.
    """
    analyses = db.query(OrganizationAnalysis).filter(
        OrganizationAnalysis.tenant_id == current_user.tenant_id
    ).order_by(OrganizationAnalysis.created_at.desc()).all()
    
    result = []
    for analysis in analyses:
        organization = db.query(Organization).filter(
            Organization.id == analysis.organization_id
        ).first()
        
        result.append({
            "analysisId": analysis.id,
            "organizationName": organization.name if organization else "Desconhecida",
            "createdAt": analysis.created_at,
            "status": analysis.status,
            "agentCount": len(analysis.results.get("recommendedAgents", []))
        })
    
    return result
