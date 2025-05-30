# Documentação Técnica - NowGo Agents Platform

## Introdução

Esta documentação técnica detalha a arquitetura, componentes e fluxos da NowGo Agents Platform, uma solução completa para criação e gerenciamento de times de agentes autônomos para empresas de médio e grande porte. A plataforma é baseada no repositório [EvolutionAPI/evo-ai](https://github.com/EvolutionAPI/evo-ai), com adições significativas para análise organizacional e geração automática de agentes personalizados.

## Arquitetura

### Visão Geral

A NowGo Agents Platform utiliza uma arquitetura em camadas com separação clara de responsabilidades:

1. **Camada de Apresentação**: Frontend lovable desenvolvido com Next.js e React
2. **Camada de API**: FastAPI com autenticação JWT e rotas RESTful
3. **Camada de Serviços**: Lógica de negócios, incluindo análise organizacional e geração de agentes
4. **Camada de Dados**: PostgreSQL para armazenamento persistente e Redis para cache

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (FastAPI)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Serviços de Negócio                       │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│  Análise    │  Geração    │  Gestão de  │ Integração  │ Gestão  │
│Organizacional│ de Agentes  │   Agentes   │  de Canais  │de Tenant│
└─────────────┴─────────────┴──────┬──────┴─────────────┴─────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Camada de Dados                           │
├─────────────────────────────┬───────────────────────────────────┤
│        PostgreSQL           │              Redis                 │
└─────────────────────────────┴───────────────────────────────────┘
```

### Multi-tenant

A arquitetura multi-tenant é implementada através de:

- **Isolamento de Dados**: Cada cliente possui seus próprios dados isolados no banco de dados
- **Controle de Acesso**: Sistema de permissões baseado em JWT com escopo por tenant
- **Recursos Compartilhados**: Templates de agentes e modelos de análise são compartilhados entre tenants

## Componentes Principais

### Backend

#### Modelos de Dados

Os principais modelos de dados incluem:

- **Client**: Representa uma empresa cliente da plataforma
- **User**: Usuários associados a um cliente específico
- **OrganizationProfile**: Perfil da organização com informações para análise
- **Agent**: Agente autônomo configurado para um cliente
- **AgentTemplate**: Template para criação de agentes específicos
- **AgentGenerationJob**: Trabalho de geração automática de agentes
- **ChannelIntegration**: Configurações de integração com canais de comunicação

#### Serviços

Os principais serviços incluem:

- **AuthService**: Autenticação e autorização de usuários
- **OrganizationAnalyzer**: Análise do perfil organizacional e recomendação de agentes
- **AgentGenerator**: Geração automática de agentes personalizados
- **AgentService**: Gerenciamento do ciclo de vida dos agentes
- **ChannelIntegration**: Integração com canais de comunicação (WhatsApp, Email, etc.)

### Frontend

#### Componentes React

Os principais componentes incluem:

- **AuthForm**: Formulário de autenticação (login/registro)
- **OrganizationAnalysisForm**: Formulário de análise organizacional
- **AgentDashboard**: Dashboard para gerenciamento de agentes
- **MainNavigation**: Navegação principal da aplicação
- **LanguageSwitcher**: Seletor de idioma para suporte multilíngue

#### Páginas

As principais páginas incluem:

- **Home**: Página inicial com informações sobre a plataforma
- **Login**: Página de autenticação
- **Dashboard**: Dashboard principal do usuário
- **OrganizationAnalysis**: Página de análise organizacional
- **Agents**: Listagem e gerenciamento de agentes
- **Integrations**: Configuração de integrações com canais

## Fluxos Principais

### Análise Organizacional e Geração de Agentes

1. O usuário preenche o formulário de análise organizacional
2. O sistema analisa o perfil da organização
3. O sistema recomenda agentes específicos para as necessidades da empresa
4. O usuário seleciona os agentes desejados
5. O sistema gera automaticamente os agentes selecionados
6. Os agentes são configurados e prontos para uso

### Integração de Canais

1. O usuário configura integrações com canais de comunicação (WhatsApp, Email, etc.)
2. O sistema valida e armazena as configurações
3. Os agentes são conectados aos canais configurados
4. Os agentes podem enviar e receber mensagens através dos canais

## API Reference

### Autenticação

```
POST /api/v1/auth/token
POST /api/v1/auth/register
GET /api/v1/auth/me
```

### Perfil Organizacional

```
POST /api/v1/organization/profile
GET /api/v1/organization/profile
PUT /api/v1/organization/profile
POST /api/v1/organization/analyze
GET /api/v1/organization/analysis-results
```

### Agentes

```
GET /api/v1/agents
POST /api/v1/agents
GET /api/v1/agents/{agent_id}
PUT /api/v1/agents/{agent_id}
DELETE /api/v1/agents/{agent_id}
```

### Geração de Agentes

```
POST /api/v1/organization/generate-agents
GET /api/v1/organization/generation-jobs
GET /api/v1/organization/generation-jobs/{job_id}
```

### Integrações

```
POST /api/v1/integrations/whatsapp
POST /api/v1/integrations/email
POST /api/v1/integrations/linkedin
POST /api/v1/integrations/phone
POST /api/v1/integrations/crm
POST /api/v1/integrations/send-message
```

## Configuração e Implantação

### Variáveis de Ambiente

```
# Database
DATABASE_URL=postgresql://user:password@localhost/nowgo_agents

# Security
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis
REDIS_URL=redis://localhost:6379/0

# LLM Providers
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Docker Compose

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nowgo_agents
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db/nowgo_agents
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: your_secret_key
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Extensibilidade

### Adicionando Novos Templates de Agentes

Para adicionar novos templates de agentes:

1. Crie um novo registro na tabela `agent_templates`
2. Defina o tipo de agente, instruções base e configurações
3. Associe o template a departamentos e indústrias específicas

### Adicionando Novos Canais de Integração

Para adicionar novos canais de integração:

1. Implemente um novo método na classe `ChannelIntegration`
2. Crie um novo endpoint na API para configuração do canal
3. Atualize o frontend para suportar o novo canal

## Considerações de Segurança

- Todas as senhas são armazenadas com hash usando bcrypt
- Autenticação é realizada via JWT com expiração configurável
- Isolamento de dados entre tenants é garantido em nível de banco de dados
- Todas as requisições API são validadas com Pydantic
- CORS é configurado para permitir apenas origens específicas

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com o banco de dados**
   - Verifique se o PostgreSQL está em execução
   - Confirme se a URL do banco de dados está correta

2. **Erro de autenticação**
   - Verifique se o token JWT é válido
   - Confirme se o usuário tem permissões adequadas

3. **Falha na geração de agentes**
   - Verifique os logs do serviço de geração
   - Confirme se as chaves de API dos provedores LLM estão configuradas

## Roadmap

- Suporte a mais canais de comunicação (Telegram, Instagram, etc.)
- Análise avançada de desempenho dos agentes
- Aprendizado contínuo e melhoria automática dos agentes
- Interface de administração para gerenciamento de múltiplos tenants
- Marketplace de templates de agentes

---

# Technical Documentation - NowGo Agents Platform

## Introduction

This technical documentation details the architecture, components, and flows of the NowGo Agents Platform, a complete solution for creating and managing teams of autonomous agents for medium and large companies. The platform is based on the [EvolutionAPI/evo-ai](https://github.com/EvolutionAPI/evo-ai) repository, with significant additions for organizational analysis and automatic generation of customized agents.

## Architecture

### Overview

The NowGo Agents Platform uses a layered architecture with clear separation of responsibilities:

1. **Presentation Layer**: Lovable frontend developed with Next.js and React
2. **API Layer**: FastAPI with JWT authentication and RESTful routes
3. **Service Layer**: Business logic, including organizational analysis and agent generation
4. **Data Layer**: PostgreSQL for persistent storage and Redis for caching

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (FastAPI)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Business Services                         │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│Organizational│   Agent     │   Agent     │  Channel    │ Tenant  │
│  Analysis   │ Generation  │ Management  │ Integration │Management│
└─────────────┴─────────────┴──────┬──────┴─────────────┴─────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Data Layer                              │
├─────────────────────────────┬───────────────────────────────────┤
│        PostgreSQL           │              Redis                 │
└─────────────────────────────┴───────────────────────────────────┘
```

### Multi-tenant

The multi-tenant architecture is implemented through:

- **Data Isolation**: Each client has their own isolated data in the database
- **Access Control**: JWT-based permission system with tenant scope
- **Shared Resources**: Agent templates and analysis models are shared between tenants

## Main Components

### Backend

#### Data Models

The main data models include:

- **Client**: Represents a client company of the platform
- **User**: Users associated with a specific client
- **OrganizationProfile**: Organization profile with information for analysis
- **Agent**: Autonomous agent configured for a client
- **AgentTemplate**: Template for creating specific agents
- **AgentGenerationJob**: Automatic agent generation job
- **ChannelIntegration**: Configuration for integration with communication channels

#### Services

The main services include:

- **AuthService**: User authentication and authorization
- **OrganizationAnalyzer**: Organizational profile analysis and agent recommendation
- **AgentGenerator**: Automatic generation of customized agents
- **AgentService**: Agent lifecycle management
- **ChannelIntegration**: Integration with communication channels (WhatsApp, Email, etc.)

### Frontend

#### React Components

The main components include:

- **AuthForm**: Authentication form (login/register)
- **OrganizationAnalysisForm**: Organizational analysis form
- **AgentDashboard**: Dashboard for agent management
- **MainNavigation**: Main application navigation
- **LanguageSwitcher**: Language selector for multilingual support

#### Pages

The main pages include:

- **Home**: Home page with information about the platform
- **Login**: Authentication page
- **Dashboard**: Main user dashboard
- **OrganizationAnalysis**: Organizational analysis page
- **Agents**: Agent listing and management
- **Integrations**: Configuration of integrations with channels

## Main Flows

### Organizational Analysis and Agent Generation

1. The user fills out the organizational analysis form
2. The system analyzes the organization's profile
3. The system recommends specific agents for the company's needs
4. The user selects the desired agents
5. The system automatically generates the selected agents
6. The agents are configured and ready for use

### Channel Integration

1. The user configures integrations with communication channels (WhatsApp, Email, etc.)
2. The system validates and stores the configurations
3. The agents are connected to the configured channels
4. The agents can send and receive messages through the channels

## API Reference

### Authentication

```
POST /api/v1/auth/token
POST /api/v1/auth/register
GET /api/v1/auth/me
```

### Organizational Profile

```
POST /api/v1/organization/profile
GET /api/v1/organization/profile
PUT /api/v1/organization/profile
POST /api/v1/organization/analyze
GET /api/v1/organization/analysis-results
```

### Agents

```
GET /api/v1/agents
POST /api/v1/agents
GET /api/v1/agents/{agent_id}
PUT /api/v1/agents/{agent_id}
DELETE /api/v1/agents/{agent_id}
```

### Agent Generation

```
POST /api/v1/organization/generate-agents
GET /api/v1/organization/generation-jobs
GET /api/v1/organization/generation-jobs/{job_id}
```

### Integrations

```
POST /api/v1/integrations/whatsapp
POST /api/v1/integrations/email
POST /api/v1/integrations/linkedin
POST /api/v1/integrations/phone
POST /api/v1/integrations/crm
POST /api/v1/integrations/send-message
```

## Configuration and Deployment

### Environment Variables

```
# Database
DATABASE_URL=postgresql://user:password@localhost/nowgo_agents

# Security
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis
REDIS_URL=redis://localhost:6379/0

# LLM Providers
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Docker Compose

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nowgo_agents
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db/nowgo_agents
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: your_secret_key
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Extensibility

### Adding New Agent Templates

To add new agent templates:

1. Create a new record in the `agent_templates` table
2. Define the agent type, base instructions, and configurations
3. Associate the template with specific departments and industries

### Adding New Integration Channels

To add new integration channels:

1. Implement a new method in the `ChannelIntegration` class
2. Create a new API endpoint for channel configuration
3. Update the frontend to support the new channel

## Security Considerations

- All passwords are stored with hash using bcrypt
- Authentication is performed via JWT with configurable expiration
- Data isolation between tenants is guaranteed at the database level
- All API requests are validated with Pydantic
- CORS is configured to allow only specific origins

## Troubleshooting

### Common Issues

1. **Database connection error**
   - Check if PostgreSQL is running
   - Confirm if the database URL is correct

2. **Authentication error**
   - Check if the JWT token is valid
   - Confirm if the user has adequate permissions

3. **Agent generation failure**
   - Check the generation service logs
   - Confirm if the LLM provider API keys are configured

## Roadmap

- Support for more communication channels (Telegram, Instagram, etc.)
- Advanced agent performance analysis
- Continuous learning and automatic improvement of agents
- Administration interface for managing multiple tenants
- Marketplace for agent templates
