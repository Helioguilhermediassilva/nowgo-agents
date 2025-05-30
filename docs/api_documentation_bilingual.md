# Documentação de API - NowGo Agents Platform

## Português

### Visão Geral da API

A API da NowGo Agents Platform permite que desenvolvedores integrem, automatizem e estendam as funcionalidades da plataforma. Esta documentação fornece informações detalhadas sobre endpoints, autenticação, formatos de requisição/resposta e exemplos de uso.

### Base URL

```
https://api.nowgo-agents.com/api/v1
```

Para ambiente de desenvolvimento local:

```
http://localhost:8000/api/v1
```

### Autenticação

A API utiliza autenticação baseada em tokens JWT (JSON Web Tokens). Para obter um token:

1. Faça uma requisição POST para `/auth/token`
2. Inclua credenciais no corpo da requisição
3. Armazene o token retornado
4. Inclua o token no cabeçalho `Authorization` de todas as requisições subsequentes

Exemplo de requisição de autenticação:

```bash
curl -X POST https://api.nowgo-agents.com/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "password": "senha123"}'
```

Exemplo de resposta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

Uso do token em requisições:

```bash
curl -X GET https://api.nowgo-agents.com/api/v1/agents \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Endpoints

#### Análise Organizacional

##### Iniciar Análise Organizacional

```
POST /organization/analyze
```

Inicia o processo de análise organizacional com base nos dados fornecidos.

**Corpo da Requisição:**

```json
{
  "company_name": "NowGo Holding",
  "industry": "technology",
  "size": "medium",
  "description": "Empresa de tecnologia focada em soluções de IA",
  "channels": ["whatsapp", "email", "phone", "linkedin"],
  "languages": ["pt", "en", "es"],
  "integrations": ["crm"],
  "objectives": ["customer_service", "sales"]
}
```

**Resposta:**

```json
{
  "analysis_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
  "status": "processing",
  "estimated_completion_time": "2023-05-30T14:30:00Z"
}
```

##### Obter Resultado da Análise

```
GET /organization/analysis/{analysis_id}
```

Retorna o resultado da análise organizacional.

**Resposta:**

```json
{
  "analysis_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
  "status": "completed",
  "company_profile": {
    "company_name": "NowGo Holding",
    "industry": "technology",
    "size": "medium",
    "needs": [
      "customer_support",
      "sales_automation",
      "lead_generation"
    ]
  },
  "recommended_agents": [
    {
      "agent_id": "agent_123",
      "name": "Virginia",
      "type": "customer_service",
      "description": "Agente de atendimento ao cliente especializado em suporte técnico",
      "confidence_score": 0.92,
      "channels": ["whatsapp", "email"],
      "languages": ["pt", "en", "es"]
    },
    {
      "agent_id": "agent_456",
      "name": "Guilherme",
      "type": "sales",
      "description": "Agente de vendas e prospecção com foco em conversão",
      "confidence_score": 0.89,
      "channels": ["whatsapp", "linkedin", "email"],
      "languages": ["pt", "en"]
    }
  ]
}
```

#### Gerenciamento de Agentes

##### Gerar Agentes

```
POST /agents/generate
```

Gera agentes com base nos resultados da análise organizacional.

**Corpo da Requisição:**

```json
{
  "analysis_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
  "agent_ids": ["agent_123", "agent_456"]
}
```

**Resposta:**

```json
{
  "generation_id": "g1h2i3j4-k5l6-7890-mnop-1234567890cd",
  "status": "processing",
  "estimated_completion_time": "2023-05-30T15:00:00Z"
}
```

##### Obter Status da Geração

```
GET /agents/generation/{generation_id}
```

Retorna o status da geração de agentes.

**Resposta:**

```json
{
  "generation_id": "g1h2i3j4-k5l6-7890-mnop-1234567890cd",
  "status": "completed",
  "agents": [
    {
      "agent_id": "agent_123",
      "name": "Virginia",
      "type": "customer_service",
      "status": "pending_validation",
      "validation_url": "/agents/validate/agent_123"
    },
    {
      "agent_id": "agent_456",
      "name": "Guilherme",
      "type": "sales",
      "status": "pending_validation",
      "validation_url": "/agents/validate/agent_456"
    }
  ]
}
```

##### Listar Agentes

```
GET /agents
```

Retorna a lista de todos os agentes.

**Parâmetros de Consulta:**
- `status` (opcional): Filtra por status (active, inactive, pending_validation)
- `type` (opcional): Filtra por tipo de agente
- `page` (opcional): Número da página para paginação
- `limit` (opcional): Número de itens por página

**Resposta:**

```json
{
  "total": 2,
  "page": 1,
  "limit": 10,
  "agents": [
    {
      "agent_id": "agent_123",
      "name": "Virginia",
      "type": "customer_service",
      "status": "active",
      "created_at": "2023-05-30T13:00:00Z",
      "updated_at": "2023-05-30T15:30:00Z"
    },
    {
      "agent_id": "agent_456",
      "name": "Guilherme",
      "type": "sales",
      "status": "active",
      "created_at": "2023-05-30T13:00:00Z",
      "updated_at": "2023-05-30T15:30:00Z"
    }
  ]
}
```

##### Obter Detalhes do Agente

```
GET /agents/{agent_id}
```

Retorna detalhes completos de um agente específico.

**Resposta:**

```json
{
  "agent_id": "agent_123",
  "name": "Virginia",
  "type": "customer_service",
  "description": "Agente de atendimento ao cliente especializado em suporte técnico",
  "status": "active",
  "prompt": "Você é Virginia, uma assistente virtual especializada em atendimento ao cliente...",
  "channels": [
    {
      "channel_id": "channel_789",
      "type": "whatsapp",
      "status": "active",
      "configuration": {
        "phone_number": "+5511999999999",
        "webhook_url": "https://api.nowgo-agents.com/webhooks/whatsapp"
      }
    },
    {
      "channel_id": "channel_012",
      "type": "email",
      "status": "active",
      "configuration": {
        "email_address": "atendimento@nowgo.com",
        "smtp_server": "smtp.nowgo.com"
      }
    }
  ],
  "metrics": {
    "total_interactions": 1250,
    "resolution_rate": 0.87,
    "average_response_time": 45,
    "satisfaction_score": 4.8
  },
  "created_at": "2023-05-30T13:00:00Z",
  "updated_at": "2023-05-30T15:30:00Z"
}
```

##### Validar Agente

```
POST /agents/{agent_id}/validate
```

Valida um agente gerado, aprovando ou rejeitando suas configurações.

**Corpo da Requisição:**

```json
{
  "approved": true,
  "feedback": "O agente está bem configurado para nossas necessidades",
  "modifications": {
    "name": "Virginia Atendimento",
    "prompt": "Você é Virginia, uma assistente virtual da NowGo Holding especializada em atendimento ao cliente..."
  }
}
```

**Resposta:**

```json
{
  "agent_id": "agent_123",
  "status": "active",
  "message": "Agente validado com sucesso"
}
```

##### Atualizar Agente

```
PUT /agents/{agent_id}
```

Atualiza as configurações de um agente existente.

**Corpo da Requisição:**

```json
{
  "name": "Virginia Atendimento Premium",
  "description": "Agente de atendimento ao cliente para clientes premium",
  "prompt": "Você é Virginia, uma assistente virtual especializada em atendimento a clientes premium...",
  "status": "active"
}
```

**Resposta:**

```json
{
  "agent_id": "agent_123",
  "name": "Virginia Atendimento Premium",
  "message": "Agente atualizado com sucesso",
  "updated_at": "2023-05-30T16:45:00Z"
}
```

##### Excluir Agente

```
DELETE /agents/{agent_id}
```

Remove um agente do sistema.

**Resposta:**

```json
{
  "message": "Agente excluído com sucesso"
}
```

#### Integrações

##### Listar Integrações Disponíveis

```
GET /integrations
```

Retorna a lista de integrações disponíveis.

**Resposta:**

```json
{
  "integrations": [
    {
      "integration_id": "whatsapp",
      "name": "WhatsApp",
      "description": "Integração com WhatsApp Business API",
      "status": "available",
      "documentation_url": "/docs/integrations/whatsapp"
    },
    {
      "integration_id": "email",
      "name": "Email",
      "description": "Integração com servidores de email via SMTP/IMAP",
      "status": "available",
      "documentation_url": "/docs/integrations/email"
    },
    {
      "integration_id": "crm",
      "name": "CRM",
      "description": "Integração com sistemas de CRM",
      "status": "available",
      "documentation_url": "/docs/integrations/crm"
    },
    {
      "integration_id": "linkedin",
      "name": "LinkedIn",
      "description": "Integração com LinkedIn para prospecção",
      "status": "available",
      "documentation_url": "/docs/integrations/linkedin"
    }
  ]
}
```

##### Configurar Integração

```
POST /integrations/{integration_id}/configure
```

Configura uma integração específica.

**Corpo da Requisição (exemplo para WhatsApp):**

```json
{
  "phone_number": "+5511999999999",
  "display_name": "NowGo Atendimento",
  "webhook_url": "https://api.nowgo-agents.com/webhooks/whatsapp",
  "api_key": "whatsapp_api_key_here",
  "business_account_id": "12345678901234"
}
```

**Resposta:**

```json
{
  "integration_id": "whatsapp",
  "status": "configured",
  "message": "Integração configurada com sucesso",
  "configuration_id": "config_123"
}
```

##### Verificar Status da Integração

```
GET /integrations/{integration_id}/status
```

Verifica o status atual de uma integração.

**Resposta:**

```json
{
  "integration_id": "whatsapp",
  "status": "active",
  "last_check": "2023-05-30T17:00:00Z",
  "health": {
    "connection": "ok",
    "authentication": "ok",
    "message_delivery": "ok"
  },
  "metrics": {
    "messages_sent": 1250,
    "messages_received": 980,
    "error_rate": 0.02
  }
}
```

#### Webhooks

##### Registrar Webhook

```
POST /webhooks/register
```

Registra um novo endpoint de webhook para receber notificações.

**Corpo da Requisição:**

```json
{
  "url": "https://sua-aplicacao.com/webhooks/nowgo",
  "events": ["agent.message", "agent.status_change", "analysis.completed"],
  "secret": "seu_segredo_para_verificacao"
}
```

**Resposta:**

```json
{
  "webhook_id": "webhook_123",
  "status": "active",
  "message": "Webhook registrado com sucesso"
}
```

##### Listar Webhooks

```
GET /webhooks
```

Retorna a lista de webhooks registrados.

**Resposta:**

```json
{
  "webhooks": [
    {
      "webhook_id": "webhook_123",
      "url": "https://sua-aplicacao.com/webhooks/nowgo",
      "events": ["agent.message", "agent.status_change", "analysis.completed"],
      "status": "active",
      "created_at": "2023-05-30T12:00:00Z"
    }
  ]
}
```

##### Testar Webhook

```
POST /webhooks/{webhook_id}/test
```

Envia um evento de teste para o webhook registrado.

**Corpo da Requisição:**

```json
{
  "event": "agent.message"
}
```

**Resposta:**

```json
{
  "webhook_id": "webhook_123",
  "test_result": "success",
  "status_code": 200,
  "response_time": 320
}
```

### Formatos de Eventos de Webhook

#### Evento: agent.message

```json
{
  "event": "agent.message",
  "timestamp": "2023-05-30T18:30:00Z",
  "data": {
    "agent_id": "agent_123",
    "agent_name": "Virginia",
    "channel": "whatsapp",
    "direction": "outbound",
    "message": {
      "id": "msg_456",
      "content": "Olá! Como posso ajudar você hoje?",
      "timestamp": "2023-05-30T18:30:00Z",
      "recipient": "+5511988888888"
    }
  }
}
```

#### Evento: agent.status_change

```json
{
  "event": "agent.status_change",
  "timestamp": "2023-05-30T19:00:00Z",
  "data": {
    "agent_id": "agent_123",
    "agent_name": "Virginia",
    "previous_status": "pending_validation",
    "new_status": "active",
    "changed_by": "user_789",
    "reason": "Validation approved"
  }
}
```

#### Evento: analysis.completed

```json
{
  "event": "analysis.completed",
  "timestamp": "2023-05-30T14:45:00Z",
  "data": {
    "analysis_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "company_name": "NowGo Holding",
    "recommended_agents_count": 2,
    "result_url": "/api/v1/organization/analysis/a1b2c3d4-e5f6-7890-abcd-1234567890ab"
  }
}
```

### Códigos de Erro

| Código | Descrição                                  |
|--------|-------------------------------------------|
| 400    | Requisição inválida                       |
| 401    | Não autorizado                            |
| 403    | Acesso proibido                           |
| 404    | Recurso não encontrado                    |
| 409    | Conflito                                  |
| 422    | Entidade não processável                  |
| 429    | Muitas requisições                        |
| 500    | Erro interno do servidor                  |

### Limites de Taxa

A API implementa limites de taxa para garantir a estabilidade do serviço:

- 100 requisições por minuto para endpoints de leitura
- 30 requisições por minuto para endpoints de escrita
- 5 requisições por minuto para análises organizacionais

Quando o limite é excedido, a API retorna o código de status 429 com cabeçalhos indicando o tempo de espera recomendado.

### SDKs e Bibliotecas Cliente

Oferecemos SDKs oficiais para as seguintes linguagens:

- Python: `pip install nowgo-agents-sdk`
- JavaScript/TypeScript: `npm install nowgo-agents-sdk`
- PHP: `composer require nowgo/agents-sdk`

Exemplo de uso em Python:

```python
from nowgo_agents_sdk import NowGoAgentsClient

# Inicializar cliente
client = NowGoAgentsClient(api_key="sua_api_key")

# Iniciar análise organizacional
analysis = client.organization.analyze(
    company_name="NowGo Holding",
    industry="technology",
    size="medium",
    channels=["whatsapp", "email", "phone", "linkedin"],
    languages=["pt", "en", "es"],
    integrations=["crm"],
    objectives=["customer_service", "sales"]
)

# Obter ID da análise
analysis_id = analysis["analysis_id"]

# Verificar resultado da análise
result = client.organization.get_analysis_result(analysis_id)

# Gerar agentes recomendados
generation = client.agents.generate(
    analysis_id=analysis_id,
    agent_ids=[agent["agent_id"] for agent in result["recommended_agents"]]
)
```

## English

### API Overview

The NowGo Agents Platform API allows developers to integrate, automate, and extend the platform's functionalities. This documentation provides detailed information about endpoints, authentication, request/response formats, and usage examples.

### Base URL

```
https://api.nowgo-agents.com/api/v1
```

For local development environment:

```
http://localhost:8000/api/v1
```

### Authentication

The API uses JWT (JSON Web Tokens) based authentication. To obtain a token:

1. Make a POST request to `/auth/token`
2. Include credentials in the request body
3. Store the returned token
4. Include the token in the `Authorization` header of all subsequent requests

Authentication request example:

```bash
curl -X POST https://api.nowgo-agents.com/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

Response example:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

Using the token in requests:

```bash
curl -X GET https://api.nowgo-agents.com/api/v1/agents \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Endpoints

#### Organizational Analysis

##### Start Organizational Analysis

```
POST /organization/analyze
```

Starts the organizational analysis process based on the provided data.

**Request Body:**

```json
{
  "company_name": "NowGo Holding",
  "industry": "technology",
  "size": "medium",
  "description": "Technology company focused on AI solutions",
  "channels": ["whatsapp", "email", "phone", "linkedin"],
  "languages": ["pt", "en", "es"],
  "integrations": ["crm"],
  "objectives": ["customer_service", "sales"]
}
```

**Response:**

```json
{
  "analysis_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
  "status": "processing",
  "estimated_completion_time": "2023-05-30T14:30:00Z"
}
```

##### Get Analysis Result

```
GET /organization/analysis/{analysis_id}
```

Returns the result of the organizational analysis.

**Response:**

```json
{
  "analysis_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
  "status": "completed",
  "company_profile": {
    "company_name": "NowGo Holding",
    "industry": "technology",
    "size": "medium",
    "needs": [
      "customer_support",
      "sales_automation",
      "lead_generation"
    ]
  },
  "recommended_agents": [
    {
      "agent_id": "agent_123",
      "name": "Virginia",
      "type": "customer_service",
      "description": "Customer service agent specialized in technical support",
      "confidence_score": 0.92,
      "channels": ["whatsapp", "email"],
      "languages": ["pt", "en", "es"]
    },
    {
      "agent_id": "agent_456",
      "name": "Guilherme",
      "type": "sales",
      "description": "Sales and prospecting agent focused on conversion",
      "confidence_score": 0.89,
      "channels": ["whatsapp", "linkedin", "email"],
      "languages": ["pt", "en"]
    }
  ]
}
```

#### Agent Management

##### Generate Agents

```
POST /agents/generate
```

Generates agents based on organizational analysis results.

**Request Body:**

```json
{
  "analysis_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
  "agent_ids": ["agent_123", "agent_456"]
}
```

**Response:**

```json
{
  "generation_id": "g1h2i3j4-k5l6-7890-mnop-1234567890cd",
  "status": "processing",
  "estimated_completion_time": "2023-05-30T15:00:00Z"
}
```

##### Get Generation Status

```
GET /agents/generation/{generation_id}
```

Returns the status of agent generation.

**Response:**

```json
{
  "generation_id": "g1h2i3j4-k5l6-7890-mnop-1234567890cd",
  "status": "completed",
  "agents": [
    {
      "agent_id": "agent_123",
      "name": "Virginia",
      "type": "customer_service",
      "status": "pending_validation",
      "validation_url": "/agents/validate/agent_123"
    },
    {
      "agent_id": "agent_456",
      "name": "Guilherme",
      "type": "sales",
      "status": "pending_validation",
      "validation_url": "/agents/validate/agent_456"
    }
  ]
}
```

##### List Agents

```
GET /agents
```

Returns the list of all agents.

**Query Parameters:**
- `status` (optional): Filter by status (active, inactive, pending_validation)
- `type` (optional): Filter by agent type
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**

```json
{
  "total": 2,
  "page": 1,
  "limit": 10,
  "agents": [
    {
      "agent_id": "agent_123",
      "name": "Virginia",
      "type": "customer_service",
      "status": "active",
      "created_at": "2023-05-30T13:00:00Z",
      "updated_at": "2023-05-30T15:30:00Z"
    },
    {
      "agent_id": "agent_456",
      "name": "Guilherme",
      "type": "sales",
      "status": "active",
      "created_at": "2023-05-30T13:00:00Z",
      "updated_at": "2023-05-30T15:30:00Z"
    }
  ]
}
```

##### Get Agent Details

```
GET /agents/{agent_id}
```

Returns complete details of a specific agent.

**Response:**

```json
{
  "agent_id": "agent_123",
  "name": "Virginia",
  "type": "customer_service",
  "description": "Customer service agent specialized in technical support",
  "status": "active",
  "prompt": "You are Virginia, a virtual assistant specialized in customer service...",
  "channels": [
    {
      "channel_id": "channel_789",
      "type": "whatsapp",
      "status": "active",
      "configuration": {
        "phone_number": "+5511999999999",
        "webhook_url": "https://api.nowgo-agents.com/webhooks/whatsapp"
      }
    },
    {
      "channel_id": "channel_012",
      "type": "email",
      "status": "active",
      "configuration": {
        "email_address": "support@nowgo.com",
        "smtp_server": "smtp.nowgo.com"
      }
    }
  ],
  "metrics": {
    "total_interactions": 1250,
    "resolution_rate": 0.87,
    "average_response_time": 45,
    "satisfaction_score": 4.8
  },
  "created_at": "2023-05-30T13:00:00Z",
  "updated_at": "2023-05-30T15:30:00Z"
}
```

##### Validate Agent

```
POST /agents/{agent_id}/validate
```

Validates a generated agent, approving or rejecting its configurations.

**Request Body:**

```json
{
  "approved": true,
  "feedback": "The agent is well configured for our needs",
  "modifications": {
    "name": "Virginia Support",
    "prompt": "You are Virginia, a virtual assistant from NowGo Holding specialized in customer service..."
  }
}
```

**Response:**

```json
{
  "agent_id": "agent_123",
  "status": "active",
  "message": "Agent successfully validated"
}
```

##### Update Agent

```
PUT /agents/{agent_id}
```

Updates the configurations of an existing agent.

**Request Body:**

```json
{
  "name": "Virginia Premium Support",
  "description": "Customer service agent for premium customers",
  "prompt": "You are Virginia, a virtual assistant specialized in premium customer service...",
  "status": "active"
}
```

**Response:**

```json
{
  "agent_id": "agent_123",
  "name": "Virginia Premium Support",
  "message": "Agent successfully updated",
  "updated_at": "2023-05-30T16:45:00Z"
}
```

##### Delete Agent

```
DELETE /agents/{agent_id}
```

Removes an agent from the system.

**Response:**

```json
{
  "message": "Agent successfully deleted"
}
```

#### Integrations

##### List Available Integrations

```
GET /integrations
```

Returns the list of available integrations.

**Response:**

```json
{
  "integrations": [
    {
      "integration_id": "whatsapp",
      "name": "WhatsApp",
      "description": "Integration with WhatsApp Business API",
      "status": "available",
      "documentation_url": "/docs/integrations/whatsapp"
    },
    {
      "integration_id": "email",
      "name": "Email",
      "description": "Integration with email servers via SMTP/IMAP",
      "status": "available",
      "documentation_url": "/docs/integrations/email"
    },
    {
      "integration_id": "crm",
      "name": "CRM",
      "description": "Integration with CRM systems",
      "status": "available",
      "documentation_url": "/docs/integrations/crm"
    },
    {
      "integration_id": "linkedin",
      "name": "LinkedIn",
      "description": "Integration with LinkedIn for prospecting",
      "status": "available",
      "documentation_url": "/docs/integrations/linkedin"
    }
  ]
}
```

##### Configure Integration

```
POST /integrations/{integration_id}/configure
```

Configures a specific integration.

**Request Body (example for WhatsApp):**

```json
{
  "phone_number": "+5511999999999",
  "display_name": "NowGo Support",
  "webhook_url": "https://api.nowgo-agents.com/webhooks/whatsapp",
  "api_key": "whatsapp_api_key_here",
  "business_account_id": "12345678901234"
}
```

**Response:**

```json
{
  "integration_id": "whatsapp",
  "status": "configured",
  "message": "Integration successfully configured",
  "configuration_id": "config_123"
}
```

##### Check Integration Status

```
GET /integrations/{integration_id}/status
```

Checks the current status of an integration.

**Response:**

```json
{
  "integration_id": "whatsapp",
  "status": "active",
  "last_check": "2023-05-30T17:00:00Z",
  "health": {
    "connection": "ok",
    "authentication": "ok",
    "message_delivery": "ok"
  },
  "metrics": {
    "messages_sent": 1250,
    "messages_received": 980,
    "error_rate": 0.02
  }
}
```

#### Webhooks

##### Register Webhook

```
POST /webhooks/register
```

Registers a new webhook endpoint to receive notifications.

**Request Body:**

```json
{
  "url": "https://your-application.com/webhooks/nowgo",
  "events": ["agent.message", "agent.status_change", "analysis.completed"],
  "secret": "your_verification_secret"
}
```

**Response:**

```json
{
  "webhook_id": "webhook_123",
  "status": "active",
  "message": "Webhook successfully registered"
}
```

##### List Webhooks

```
GET /webhooks
```

Returns the list of registered webhooks.

**Response:**

```json
{
  "webhooks": [
    {
      "webhook_id": "webhook_123",
      "url": "https://your-application.com/webhooks/nowgo",
      "events": ["agent.message", "agent.status_change", "analysis.completed"],
      "status": "active",
      "created_at": "2023-05-30T12:00:00Z"
    }
  ]
}
```

##### Test Webhook

```
POST /webhooks/{webhook_id}/test
```

Sends a test event to the registered webhook.

**Request Body:**

```json
{
  "event": "agent.message"
}
```

**Response:**

```json
{
  "webhook_id": "webhook_123",
  "test_result": "success",
  "status_code": 200,
  "response_time": 320
}
```

### Webhook Event Formats

#### Event: agent.message

```json
{
  "event": "agent.message",
  "timestamp": "2023-05-30T18:30:00Z",
  "data": {
    "agent_id": "agent_123",
    "agent_name": "Virginia",
    "channel": "whatsapp",
    "direction": "outbound",
    "message": {
      "id": "msg_456",
      "content": "Hello! How can I help you today?",
      "timestamp": "2023-05-30T18:30:00Z",
      "recipient": "+5511988888888"
    }
  }
}
```

#### Event: agent.status_change

```json
{
  "event": "agent.status_change",
  "timestamp": "2023-05-30T19:00:00Z",
  "data": {
    "agent_id": "agent_123",
    "agent_name": "Virginia",
    "previous_status": "pending_validation",
    "new_status": "active",
    "changed_by": "user_789",
    "reason": "Validation approved"
  }
}
```

#### Event: analysis.completed

```json
{
  "event": "analysis.completed",
  "timestamp": "2023-05-30T14:45:00Z",
  "data": {
    "analysis_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "company_name": "NowGo Holding",
    "recommended_agents_count": 2,
    "result_url": "/api/v1/organization/analysis/a1b2c3d4-e5f6-7890-abcd-1234567890ab"
  }
}
```

### Error Codes

| Code | Description                               |
|------|-------------------------------------------|
| 400  | Bad request                               |
| 401  | Unauthorized                              |
| 403  | Forbidden                                 |
| 404  | Resource not found                        |
| 409  | Conflict                                  |
| 422  | Unprocessable entity                      |
| 429  | Too many requests                         |
| 500  | Internal server error                     |

### Rate Limits

The API implements rate limits to ensure service stability:

- 100 requests per minute for read endpoints
- 30 requests per minute for write endpoints
- 5 requests per minute for organizational analyses

When the limit is exceeded, the API returns status code 429 with headers indicating the recommended wait time.

### SDKs and Client Libraries

We offer official SDKs for the following languages:

- Python: `pip install nowgo-agents-sdk`
- JavaScript/TypeScript: `npm install nowgo-agents-sdk`
- PHP: `composer require nowgo/agents-sdk`

Example usage in Python:

```python
from nowgo_agents_sdk import NowGoAgentsClient

# Initialize client
client = NowGoAgentsClient(api_key="your_api_key")

# Start organizational analysis
analysis = client.organization.analyze(
    company_name="NowGo Holding",
    industry="technology",
    size="medium",
    channels=["whatsapp", "email", "phone", "linkedin"],
    languages=["pt", "en", "es"],
    integrations=["crm"],
    objectives=["customer_service", "sales"]
)

# Get analysis ID
analysis_id = analysis["analysis_id"]

# Check analysis result
result = client.organization.get_analysis_result(analysis_id)

# Generate recommended agents
generation = client.agents.generate(
    analysis_id=analysis_id,
    agent_ids=[agent["agent_id"] for agent in result["recommended_agents"]]
)
```
