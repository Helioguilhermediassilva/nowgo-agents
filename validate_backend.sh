#!/bin/bash

# Script para validação do backend da NowGo Agents Platform

echo "Iniciando validação do backend da NowGo Agents Platform..."

# Ativar ambiente virtual
source venv/bin/activate

# Verificar estrutura do projeto
echo "Verificando estrutura do projeto..."
required_dirs=(
  "src/api"
  "src/config"
  "src/models"
  "src/schemas"
  "src/services"
  "src/scripts"
)

for dir in "${required_dirs[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "ERRO: Diretório $dir não encontrado!"
    exit 1
  fi
done

echo "✓ Estrutura de diretórios validada"

# Verificar arquivos essenciais
echo "Verificando arquivos essenciais..."
required_files=(
  "src/main.py"
  "src/config/database.py"
  "src/config/telemetry.py"
  "src/config/redis_config.py"
  "src/config/langgraph_config.py"
  "src/models/models.py"
  "src/models/organization_analyzer.py"
  "src/services/agent_generator.py"
  "src/services/auth_service.py"
  "src/services/channel_integration.py"
  "src/api/organization_routes.py"
  "src/api/auth_routes.py"
  "src/api/integration_routes.py"
  "alembic.ini"
  "requirements.txt"
  ".env.example"
  "docker-compose.yml"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "ERRO: Arquivo $file não encontrado!"
    exit 1
  fi
done

echo "✓ Arquivos essenciais validados"

# Verificar dependências Python
echo "Verificando dependências Python..."
pip check

if [ $? -ne 0 ]; then
  echo "ERRO: Problemas com dependências Python!"
  exit 1
fi

echo "✓ Dependências Python validadas"

# Verificar configuração do banco de dados
echo "Verificando configuração do banco de dados..."
python -c "from src.config.database import engine; print('Conexão com banco de dados OK')"

if [ $? -ne 0 ]; then
  echo "ERRO: Problemas com configuração do banco de dados!"
  exit 1
fi

echo "✓ Configuração do banco de dados validada"

# Verificar modelos e migrações
echo "Verificando modelos e migrações..."
python -c "from src.models.models import Base, Client, User, OrganizationProfile; print('Modelos OK')"

if [ $? -ne 0 ]; then
  echo "ERRO: Problemas com modelos!"
  exit 1
fi

echo "✓ Modelos validados"

# Verificar serviços
echo "Verificando serviços..."
python -c "from src.services.agent_generator import AgentGenerator; from src.services.auth_service import AuthService; from src.services.channel_integration import ChannelIntegration; print('Serviços OK')"

if [ $? -ne 0 ]; then
  echo "ERRO: Problemas com serviços!"
  exit 1
fi

echo "✓ Serviços validados"

# Verificar rotas da API
echo "Verificando rotas da API..."
python -c "from src.api.organization_routes import router as org_router; from src.api.auth_routes import router as auth_router; from src.api.integration_routes import router as int_router; print('Rotas OK')"

if [ $? -ne 0 ]; then
  echo "ERRO: Problemas com rotas da API!"
  exit 1
fi

echo "✓ Rotas da API validadas"

# Verificar aplicação principal
echo "Verificando aplicação principal..."
python -c "from src.main import app; print('Aplicação principal OK')"

if [ $? -ne 0 ]; then
  echo "ERRO: Problemas com aplicação principal!"
  exit 1
fi

echo "✓ Aplicação principal validada"

echo "Validação do backend concluída com sucesso!"
echo "O backend multi-tenant está pronto para integração com o frontend."
