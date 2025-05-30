# README.md - NowGo Agents Platform

<div align="center">
  <h1>NowGo Agents Platform</h1>
  <p>Plataforma multi-tenant para geração automática de agentes autônomos personalizados para qualquer empresa</p>
  <p><strong>Português</strong> | <a href="#english">English</a></p>
</div>

## Sobre o Projeto

NowGo Agents Platform é uma solução completa para criação e gerenciamento de times de agentes autônomos para empresas de médio e grande porte. Baseada no repositório [EvolutionAPI/evo-ai](https://github.com/EvolutionAPI/evo-ai), nossa plataforma adiciona recursos avançados de análise organizacional e geração automática de agentes personalizados.

### Principais Recursos

- **Análise Organizacional**: Sistema inteligente que analisa o perfil da empresa para recomendar os agentes mais adequados
- **Geração Automática**: Criação automática de agentes personalizados com base nas necessidades específicas da empresa
- **Multi-tenant**: Arquitetura robusta que suporta múltiplas empresas com isolamento de dados
- **Integração Multi-canal**: Suporte a WhatsApp, Email, Telefone, LinkedIn e outros canais de comunicação
- **Experiência Lovable**: Frontend desenvolvido com princípios de design lovable para uma experiência excepcional
- **Multilíngue**: Suporte completo a português, inglês e espanhol em toda a plataforma

## Tecnologias Utilizadas

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis
- JWT
- Alembic
- Pydantic
- Uvicorn
- LangGraph

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- ReactFlow

### Observabilidade
- Langfuse com OpenTelemetry (OTel)

## Instalação e Uso

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- PostgreSQL
- Redis

### Configuração do Backend

```bash
# Clonar o repositório
git clone https://github.com/NowGoHolding/nowgo-agents.git
cd nowgo-agents

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Executar migrações
alembic upgrade head

# Iniciar o servidor
uvicorn src.main:app --reload
```

### Configuração do Frontend

```bash
# Na pasta do projeto
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Arquitetura

A plataforma NowGo Agents é construída com uma arquitetura em camadas:

1. **Camada de Apresentação**: Frontend lovable desenvolvido com Next.js e React
2. **Camada de API**: FastAPI com autenticação JWT e rotas RESTful
3. **Camada de Serviços**: Lógica de negócios, incluindo análise organizacional e geração de agentes
4. **Camada de Dados**: PostgreSQL para armazenamento persistente e Redis para cache

## Contribuição

Contribuições são bem-vindas! Por favor, leia nosso guia de contribuição antes de enviar pull requests.

## Licença

Este projeto está licenciado sob a Licença Apache 2.0 - veja o arquivo LICENSE para detalhes.

---

<div id="english" align="center">
  <h1>NowGo Agents Platform</h1>
  <p>Multi-tenant platform for automatic generation of customized autonomous agents for any company</p>
  <p><a href="#top">Português</a> | <strong>English</strong></p>
</div>

## About the Project

NowGo Agents Platform is a complete solution for creating and managing teams of autonomous agents for medium and large companies. Based on the [EvolutionAPI/evo-ai](https://github.com/EvolutionAPI/evo-ai) repository, our platform adds advanced organizational analysis and automatic generation of customized agents.

### Key Features

- **Organizational Analysis**: Intelligent system that analyzes the company's profile to recommend the most suitable agents
- **Automatic Generation**: Automatic creation of customized agents based on the specific needs of the company
- **Multi-tenant**: Robust architecture that supports multiple companies with data isolation
- **Multi-channel Integration**: Support for WhatsApp, Email, Phone, LinkedIn, and other communication channels
- **Lovable Experience**: Frontend developed with lovable design principles for an exceptional experience
- **Multilingual**: Full support for Portuguese, English, and Spanish throughout the platform

## Technologies Used

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis
- JWT
- Alembic
- Pydantic
- Uvicorn
- LangGraph

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- ReactFlow

### Observability
- Langfuse with OpenTelemetry (OTel)

## Installation and Usage

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL
- Redis

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/NowGoHolding/nowgo-agents.git
cd nowgo-agents

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit the .env file with your settings

# Run migrations
alembic upgrade head

# Start the server
uvicorn src.main:app --reload
```

### Frontend Setup

```bash
# In the project folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Architecture

The NowGo Agents platform is built with a layered architecture:

1. **Presentation Layer**: Lovable frontend developed with Next.js and React
2. **API Layer**: FastAPI with JWT authentication and RESTful routes
3. **Service Layer**: Business logic, including organizational analysis and agent generation
4. **Data Layer**: PostgreSQL for persistent storage and Redis for caching

## Contributing

Contributions are welcome! Please read our contribution guide before submitting pull requests.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
