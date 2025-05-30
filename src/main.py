"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ Arquivo principal da aplicação                                              │
│                                                                             │
│ Este arquivo configura e inicializa a aplicação FastAPI, registrando        │
│ todas as rotas, middlewares e configurações necessárias.                    │
└─────────────────────────────────────────────────────────────────────────────┘
"""

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import time
from typing import Dict, List, Optional, Any

# Importar configurações
from src.config.database import engine, Base, get_db
from src.config.telemetry import setup_telemetry
from src.config.redis_config import setup_redis
from src.config.langgraph_config import setup_langgraph

# Importar rotas
from src.api.auth_routes import router as auth_router
from src.api.organization_routes import router as organization_router
from src.api.agent_routes import router as agent_router
from src.api.integration_routes import router as integration_router

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Configurar telemetria
tracer = setup_telemetry("nowgo-agents")

# Configurar Redis
redis_client = setup_redis()

# Configurar LangGraph
langgraph_client = setup_langgraph()

# Criar aplicação FastAPI
app = FastAPI(
    title="NowGo Agents Platform",
    description="Plataforma para criação e gerenciamento de agentes autônomos para empresas",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para telemetria
@app.middleware("http")
async def add_telemetry(request: Request, call_next):
    start_time = time.time()
    
    # Iniciar span de telemetria
    with tracer.start_as_current_span(
        f"{request.method} {request.url.path}",
        attributes={
            "http.method": request.method,
            "http.url": str(request.url),
            "http.route": request.url.path,
        }
    ) as span:
        # Processar requisição
        response = await call_next(request)
        
        # Adicionar atributos ao span
        span.set_attribute("http.status_code", response.status_code)
        span.set_attribute("duration_ms", (time.time() - start_time) * 1000)
        
        return response

# Middleware para tratamento de erros
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Registrar erro na telemetria
    with tracer.start_as_current_span("error_handler") as span:
        span.set_attribute("error", True)
        span.set_attribute("error.message", str(exc))
        span.set_attribute("error.type", exc.__class__.__name__)
    
    # Retornar resposta de erro
    return JSONResponse(
        status_code=500,
        content={"detail": f"Erro interno: {str(exc)}"}
    )

# Registrar rotas
app.include_router(auth_router)
app.include_router(organization_router)
app.include_router(agent_router)
app.include_router(integration_router)

# Rota de verificação de saúde
@app.get("/api/health", tags=["health"])
async def health_check():
    """
    Verifica a saúde da aplicação.
    """
    return {
        "status": "ok",
        "version": "1.0.0",
        "timestamp": time.time()
    }

# Rota raiz
@app.get("/", tags=["root"])
async def root():
    """
    Redireciona para a documentação da API.
    """
    return {"message": "Bem-vindo à NowGo Agents Platform. Acesse /api/docs para a documentação."}

# Iniciar aplicação se executado diretamente
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=os.getenv("ENVIRONMENT", "development") == "development"
    )
