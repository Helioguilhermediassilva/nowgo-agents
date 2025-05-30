#!/bin/bash

# Script para configurar o ambiente de desenvolvimento da NowGo Agents Platform

echo "Configurando ambiente de desenvolvimento para NowGo Agents Platform..."

# Verificar dependências
echo "Verificando dependências..."
command -v python3 >/dev/null 2>&1 || { echo "Python 3 não encontrado. Por favor, instale-o."; exit 1; }
command -v pip3 >/dev/null 2>&1 || { echo "Pip não encontrado. Por favor, instale-o."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js não encontrado. Por favor, instale-o."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "NPM não encontrado. Por favor, instale-o."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker não encontrado. Por favor, instale-o."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose não encontrado. Por favor, instale-o."; exit 1; }

# Criar ambiente virtual Python
echo "Criando ambiente virtual Python..."
python3 -m venv venv
source venv/bin/activate

# Instalar dependências Python
echo "Instalando dependências Python..."
pip install -r requirements.txt

# Configurar variáveis de ambiente
echo "Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Arquivo .env criado. Por favor, edite-o com suas configurações."
fi

# Configurar banco de dados
echo "Configurando banco de dados..."
docker-compose up -d db redis

# Executar migrações
echo "Executando migrações do banco de dados..."
alembic upgrade head

# Configurar frontend
echo "Configurando frontend..."
cd frontend
npm install
cd ..

echo "Ambiente de desenvolvimento configurado com sucesso!"
echo "Para iniciar o backend: cd src && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo "Para iniciar o frontend: cd frontend && npm run dev"
