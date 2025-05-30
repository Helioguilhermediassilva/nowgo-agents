# Arquitetura Multi-Tenant para NowGo Agents Platform

## Português

### Visão Geral

A arquitetura multi-tenant da NowGo Agents Platform foi projetada para atender empresas de médio e grande porte com total isolamento de dados, escalabilidade e personalização. Este documento detalha o planejamento e a implementação da estrutura genérica que permite adaptar a plataforma para qualquer empresa.

### Modelo de Dados Multi-Tenant

#### Estratégia de Isolamento

A plataforma utiliza uma abordagem de "discriminador de coluna" para implementar multi-tenancy:

1. **Identificador de Cliente**: Cada tabela principal contém uma coluna `client_id` que associa os registros a um cliente específico.
2. **Filtro Automático**: Todas as consultas são automaticamente filtradas pelo `client_id` do usuário autenticado.
3. **Políticas de Acesso**: Regras de autorização garantem que usuários só possam acessar dados do seu próprio cliente.

#### Hierarquia de Dados

```
Cliente
  └── Usuários
  └── Perfil Organizacional
       └── Análises Organizacionais
       └── Agentes
            └── Configurações de Agentes
            └── Integrações de Canais
```

### Parametrização e Personalização

#### Níveis de Personalização

1. **Nível de Cliente**: Configurações globais para toda a organização
   - Idiomas suportados
   - Canais de comunicação habilitados
   - Integrações com sistemas externos

2. **Nível de Perfil**: Configurações específicas do perfil organizacional
   - Setor de atuação
   - Tamanho da empresa
   - Métricas de sucesso

3. **Nível de Agente**: Configurações individuais para cada agente
   - Personalidade e tom
   - Conhecimentos específicos
   - Fluxos de trabalho

#### Sistema de Templates

A plataforma inclui templates pré-configurados para diferentes setores:

- Varejo
- Saúde
- Finanças
- Tecnologia
- Educação
- Manufatura
- Serviços Profissionais

Cada template pode ser personalizado e adaptado às necessidades específicas da empresa.

### Governança e Controle de Acesso

#### Modelo de Permissões

1. **Administrador Global**: Acesso completo à plataforma
2. **Administrador de Cliente**: Gerencia configurações do cliente
3. **Gerente de Agentes**: Configura e monitora agentes
4. **Usuário Padrão**: Interage com agentes e visualiza relatórios

#### Auditoria e Compliance

- Registro detalhado de todas as ações (audit trail)
- Histórico de alterações em configurações
- Retenção de dados configurável por cliente
- Exportação de dados para compliance

### Escalabilidade

#### Estratégia de Particionamento

- Particionamento horizontal de dados por `client_id`
- Índices otimizados para consultas filtradas por cliente
- Cache distribuído com Redis para melhorar performance

#### Arquitetura de Microsserviços

A plataforma pode ser implantada como:

1. **Monolito**: Para implantações menores ou testes
2. **Microsserviços**: Para escala empresarial
   - Serviço de Autenticação
   - Serviço de Análise Organizacional
   - Serviço de Geração de Agentes
   - Serviço de Integrações
   - Serviço de Monitoramento

## English

### Overview

The multi-tenant architecture of the NowGo Agents Platform has been designed to serve medium and large companies with complete data isolation, scalability, and customization. This document details the planning and implementation of the generic structure that allows adapting the platform for any company.

### Multi-Tenant Data Model

#### Isolation Strategy

The platform uses a "column discriminator" approach to implement multi-tenancy:

1. **Client Identifier**: Each main table contains a `client_id` column that associates records with a specific client.
2. **Automatic Filtering**: All queries are automatically filtered by the authenticated user's `client_id`.
3. **Access Policies**: Authorization rules ensure users can only access data from their own client.

#### Data Hierarchy

```
Client
  └── Users
  └── Organizational Profile
       └── Organizational Analyses
       └── Agents
            └── Agent Configurations
            └── Channel Integrations
```

### Parameterization and Customization

#### Customization Levels

1. **Client Level**: Global settings for the entire organization
   - Supported languages
   - Enabled communication channels
   - Integrations with external systems

2. **Profile Level**: Specific settings for the organizational profile
   - Industry
   - Company size
   - Success metrics

3. **Agent Level**: Individual settings for each agent
   - Personality and tone
   - Specific knowledge
   - Workflows

#### Template System

The platform includes pre-configured templates for different sectors:

- Retail
- Healthcare
- Finance
- Technology
- Education
- Manufacturing
- Professional Services

Each template can be customized and adapted to the specific needs of the company.

### Governance and Access Control

#### Permission Model

1. **Global Administrator**: Complete access to the platform
2. **Client Administrator**: Manages client settings
3. **Agent Manager**: Configures and monitors agents
4. **Standard User**: Interacts with agents and views reports

#### Audit and Compliance

- Detailed record of all actions (audit trail)
- History of changes to settings
- Configurable data retention by client
- Data export for compliance

### Scalability

#### Partitioning Strategy

- Horizontal data partitioning by `client_id`
- Optimized indexes for client-filtered queries
- Distributed cache with Redis to improve performance

#### Microservices Architecture

The platform can be deployed as:

1. **Monolith**: For smaller deployments or testing
2. **Microservices**: For enterprise scale
   - Authentication Service
   - Organizational Analysis Service
   - Agent Generation Service
   - Integrations Service
   - Monitoring Service
