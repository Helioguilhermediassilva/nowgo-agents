"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: NowGo Holding                                                       │
│ @file: auth_routes.py                                                        │
│ Developed by: NowGo Holding AI Team                                          │
│ Creation date: May 30, 2025                                                  │
│ Contact: ai@nowgo.holding                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © NowGo Holding 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
└──────────────────────────────────────────────────────────────────────────────┘
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Dict, Any

from src.config.database import get_db
from src.services.auth_service import (
    authenticate_user,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from src.models.models import User

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/token", response_model=Dict[str, Any])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "email": user.email,
        "is_admin": user.is_admin,
        "client_id": str(user.client_id) if user.client_id else None
    }

@router.get("/me", response_model=Dict[str, Any])
async def read_users_me(current_user = Depends(get_current_user)):
    """
    Get current user information
    """
    return {
        "user_id": str(current_user.id),
        "email": current_user.email,
        "is_admin": current_user.is_admin,
        "client_id": str(current_user.client_id) if current_user.client_id else None
    }
