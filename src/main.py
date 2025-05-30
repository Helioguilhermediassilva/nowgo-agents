"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: NowGo Holding                                                       │
│ @file: main.py                                                               │
│ Developed by: NowGo Holding AI Team                                          │
│ Creation date: May 30, 2025                                                  │
│ Contact: ai@nowgo.holding                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © NowGo Holding 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
└──────────────────────────────────────────────────────────────────────────────┘
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from src.config.database import engine, Base, get_db
from src.api.organization_routes import router as organization_router
from src.api.agent_routes import router as agent_router
from src.api.auth_routes import router as auth_router
from src.api.client_routes import router as client_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NowGo Agents Platform",
    description="Multi-tenant platform for automatic agent generation and management",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(client_router)
app.include_router(organization_router)
app.include_router(agent_router)

# Mount static files for frontend
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {
        "message": "Welcome to NowGo Agents Platform API",
        "version": "1.0.0",
        "documentation": "/docs",
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
