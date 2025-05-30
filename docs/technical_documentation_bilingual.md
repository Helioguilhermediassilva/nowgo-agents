# Documentação Técnica - NowGo Agents Platform

## Português

### Visão Geral da Arquitetura

A NowGo Agents Platform é uma solução completa para criação e gerenciamento de agentes autônomos para empresas de médio e grande porte. A plataforma utiliza uma arquitetura multi-tenant robusta, baseada no repositório [EvolutionAPI/evo-ai](https://github.com/EvolutionAPI/evo-ai), com componentes adicionais para análise organizacional e geração automática de agentes.

A arquitetura da plataforma é dividida em camadas:

1. **Camada de Apresentação**: Frontend lovable desenvolvido com Next.js, React, TypeScript e Tailwind CSS.
2. **Camada de API**: API RESTful desenvolvida com FastAPI, com autenticação JWT e documentação OpenAPI.
3. **Camada de Serviços**: Lógica de negócios, incluindo análise organizacional e geração de agentes.
4. **Camada de Dados**: Modelos de dados e acesso ao banco de dados com SQLAlchemy.
5. **Camada de Infraestrutura**: Configurações de banco de dados, cache, telemetria e integração com serviços externos.

### Tecnologias Utilizadas

#### Backend
- **FastAPI**: Framework web de alta performance para APIs
- **SQLAlchemy**: ORM para acesso ao banco de dados
- **PostgreSQL**: Banco de dados relacional
- **Redis**: Cache e armazenamento de sessões
- **JWT**: Autenticação e autorização
- **Alembic**: Migrações de banco de dados
- **Pydantic**: Validação de dados e serialização
- **Uvicorn**: Servidor ASGI para FastAPI
- **LangGraph**: Framework para construção de agentes com LLMs

#### Frontend
- **Next.js 15**: Framework React com renderização híbrida
- **React 18**: Biblioteca para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes de UI reutilizáveis
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de esquemas
- **ReactFlow**: Visualização de fluxos de trabalho

#### Observabilidade
- **Langfuse**: Plataforma de observabilidade para LLMs
- **OpenTelemetry (OTel)**: Framework para telemetria

#### Protocolos
- **A2A (Agent-to-Agent)**: Protocolo para comunicação entre agentes

### Componentes Principais

#### Sistema de Análise Organizacional

O sistema de análise organizacional é responsável por coletar e processar informações sobre a empresa para identificar suas necessidades específicas. Ele considera:

- Setor de atuação
- Tamanho da empresa
- Canais de comunicação utilizados
- Idiomas suportados
- Integrações com sistemas existentes
- Objetivos de negócio

Com base nessas informações, o sistema gera recomendações de agentes personalizados que melhor atendem às necessidades da empresa.

#### Geração Automática de Agentes

O sistema de geração automática de agentes utiliza os resultados da análise organizacional para criar e configurar agentes personalizados. Ele:

1. Interpreta os resultados da análise
2. Seleciona os tipos de agentes mais adequados
3. Gera configurações personalizadas para cada agente
4. Cria instâncias dos agentes no sistema
5. Configura canais de comunicação e integrações

Os agentes gerados são configurados com prompts específicos para cada função, considerando o contexto da empresa e seus objetivos.

#### Validação e Feedback do Usuário

O sistema de validação e feedback permite que o usuário final revise, aprove, rejeite ou modifique os agentes gerados automaticamente. Ele oferece:

1. Visualização detalhada das configurações dos agentes
2. Edição de prompts, nomes e descrições
3. Aprovação ou rejeição de agentes
4. Fornecimento de feedback para melhorias
5. Implantação automática após aprovação

### Fluxos de Trabalho

#### Análise Organizacional

1. O usuário preenche o formulário de análise organizacional
2. O sistema processa os dados e identifica necessidades
3. O sistema gera recomendações de agentes
4. Os resultados são apresentados ao usuário

#### Geração e Validação de Agentes

1. O usuário solicita a geração de agentes a partir de uma análise
2. O sistema cria e configura os agentes recomendados
3. O usuário revisa cada agente gerado
4. O usuário aprova, rejeita ou modifica os agentes
5. Os agentes aprovados são implantados automaticamente

#### Integração com Canais de Comunicação

1. O sistema configura os canais de comunicação para cada agente
2. Os agentes são conectados aos canais especificados
3. O sistema monitora e registra as interações
4. As métricas de desempenho são coletadas e apresentadas

### Segurança e Multi-tenancy

A plataforma implementa um modelo de segurança multi-tenant, garantindo:

1. Isolamento completo de dados entre tenants
2. Autenticação e autorização baseadas em JWT
3. Controle de acesso baseado em funções
4. Criptografia de dados sensíveis
5. Auditoria de ações e acessos

### Observabilidade e Monitoramento

A plataforma utiliza OpenTelemetry e Langfuse para:

1. Monitoramento de desempenho
2. Rastreamento de requisições
3. Coleta de métricas
4. Análise de logs
5. Alertas e notificações

### Escalabilidade e Alta Disponibilidade

A arquitetura da plataforma foi projetada para:

1. Escalabilidade horizontal
2. Balanceamento de carga
3. Recuperação de falhas
4. Backup e restauração de dados
5. Operação contínua

## English

### Architecture Overview

The NowGo Agents Platform is a complete solution for creating and managing autonomous agents for medium and large enterprises. The platform uses a robust multi-tenant architecture, based on the [EvolutionAPI/evo-ai](https://github.com/EvolutionAPI/evo-ai) repository, with additional components for organizational analysis and automatic agent generation.

The platform architecture is divided into layers:

1. **Presentation Layer**: Lovable frontend developed with Next.js, React, TypeScript, and Tailwind CSS.
2. **API Layer**: RESTful API developed with FastAPI, with JWT authentication and OpenAPI documentation.
3. **Service Layer**: Business logic, including organizational analysis and agent generation.
4. **Data Layer**: Data models and database access with SQLAlchemy.
5. **Infrastructure Layer**: Database configurations, cache, telemetry, and integration with external services.

### Technologies Used

#### Backend
- **FastAPI**: High-performance web framework for APIs
- **SQLAlchemy**: ORM for database access
- **PostgreSQL**: Relational database
- **Redis**: Cache and session storage
- **JWT**: Authentication and authorization
- **Alembic**: Database migrations
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for FastAPI
- **LangGraph**: Framework for building agents with LLMs

#### Frontend
- **Next.js 15**: React framework with hybrid rendering
- **React 18**: Library for building interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **ReactFlow**: Workflow visualization

#### Observability
- **Langfuse**: Observability platform for LLMs
- **OpenTelemetry (OTel)**: Framework for telemetry

#### Protocols
- **A2A (Agent-to-Agent)**: Protocol for communication between agents

### Main Components

#### Organizational Analysis System

The organizational analysis system is responsible for collecting and processing information about the company to identify its specific needs. It considers:

- Industry sector
- Company size
- Communication channels used
- Supported languages
- Integrations with existing systems
- Business objectives

Based on this information, the system generates recommendations for personalized agents that best meet the company's needs.

#### Automatic Agent Generation

The automatic agent generation system uses the results of the organizational analysis to create and configure personalized agents. It:

1. Interprets the analysis results
2. Selects the most suitable agent types
3. Generates personalized configurations for each agent
4. Creates agent instances in the system
5. Configures communication channels and integrations

The generated agents are configured with specific prompts for each function, considering the company's context and objectives.

#### User Validation and Feedback

The validation and feedback system allows the end user to review, approve, reject, or modify automatically generated agents. It offers:

1. Detailed visualization of agent configurations
2. Editing of prompts, names, and descriptions
3. Approval or rejection of agents
4. Providing feedback for improvements
5. Automatic deployment after approval

### Workflows

#### Organizational Analysis

1. The user fills out the organizational analysis form
2. The system processes the data and identifies needs
3. The system generates agent recommendations
4. The results are presented to the user

#### Agent Generation and Validation

1. The user requests agent generation from an analysis
2. The system creates and configures the recommended agents
3. The user reviews each generated agent
4. The user approves, rejects, or modifies the agents
5. Approved agents are automatically deployed

#### Integration with Communication Channels

1. The system configures communication channels for each agent
2. Agents are connected to the specified channels
3. The system monitors and records interactions
4. Performance metrics are collected and presented

### Security and Multi-tenancy

The platform implements a multi-tenant security model, ensuring:

1. Complete data isolation between tenants
2. JWT-based authentication and authorization
3. Role-based access control
4. Encryption of sensitive data
5. Auditing of actions and accesses

### Observability and Monitoring

The platform uses OpenTelemetry and Langfuse for:

1. Performance monitoring
2. Request tracing
3. Metrics collection
4. Log analysis
5. Alerts and notifications

### Scalability and High Availability

The platform architecture was designed for:

1. Horizontal scalability
2. Load balancing
3. Fault recovery
4. Data backup and restoration
5. Continuous operation
