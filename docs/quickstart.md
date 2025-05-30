# NowGo Agents - Guia de Início Rápido

Este guia fornece instruções passo a passo para iniciar rapidamente com a plataforma NowGo Agents.

## Instalação com Docker

A maneira mais fácil de executar a plataforma NowGo Agents é usando Docker Compose:

```bash
# Clonar o repositório
git clone https://github.com/NowGoHolding/nowgo-agents.git
cd nowgo-agents

# Iniciar os serviços
docker-compose up -d
```

Isso iniciará todos os serviços necessários:
- PostgreSQL (banco de dados)
- Redis (cache)
- Backend (API FastAPI)
- Frontend (Next.js)

## Acessando a Plataforma

Após iniciar os serviços, você pode acessar:

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

## Primeiros Passos

1. **Criar uma conta**: Acesse http://localhost:3000/login e clique em "Criar Conta"
2. **Configurar perfil organizacional**: Preencha o formulário de análise organizacional
3. **Gerar agentes**: Selecione os agentes recomendados e gere-os automaticamente
4. **Configurar integrações**: Configure os canais de comunicação desejados

## Configuração Manual

Se preferir executar sem Docker:

### Backend

```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar o servidor
uvicorn src.main:app --reload
```

### Frontend

```bash
# Na pasta do projeto
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Próximos Passos

- Consulte a [Documentação Técnica](./docs/technical_documentation.md) para detalhes completos
- Explore a API através da documentação Swagger em http://localhost:8000/docs
- Personalize os templates de agentes para suas necessidades específicas

---

# NowGo Agents - Quick Start Guide

This guide provides step-by-step instructions to quickly get started with the NowGo Agents platform.

## Installation with Docker

The easiest way to run the NowGo Agents platform is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/NowGoHolding/nowgo-agents.git
cd nowgo-agents

# Start the services
docker-compose up -d
```

This will start all necessary services:
- PostgreSQL (database)
- Redis (cache)
- Backend (FastAPI API)
- Frontend (Next.js)

## Accessing the Platform

After starting the services, you can access:

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

## First Steps

1. **Create an account**: Go to http://localhost:3000/login and click on "Create Account"
2. **Set up organizational profile**: Fill out the organizational analysis form
3. **Generate agents**: Select the recommended agents and generate them automatically
4. **Configure integrations**: Set up the desired communication channels

## Manual Setup

If you prefer to run without Docker:

### Backend

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit the .env file with your settings

# Start the server
uvicorn src.main:app --reload
```

### Frontend

```bash
# In the project folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Next Steps

- Check the [Technical Documentation](./docs/technical_documentation.md) for complete details
- Explore the API through the Swagger documentation at http://localhost:8000/docs
- Customize the agent templates for your specific needs
