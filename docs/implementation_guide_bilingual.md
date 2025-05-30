# Guia de Implementação - NowGo Agents Platform

## Português

### Introdução

Este guia fornece instruções detalhadas para implementação da NowGo Agents Platform, uma solução completa para criação e gerenciamento de agentes autônomos para empresas de médio e grande porte. A plataforma permite analisar as necessidades específicas de qualquer organização e gerar automaticamente agentes personalizados.

### Pré-requisitos

Antes de iniciar a implementação, certifique-se de que seu ambiente atende aos seguintes requisitos:

- **Sistema Operacional**: Linux (Ubuntu 20.04+ recomendado), macOS ou Windows com WSL2
- **Docker**: Versão 20.10.0 ou superior
- **Docker Compose**: Versão 2.0.0 ou superior
- **Git**: Versão 2.30.0 ou superior
- **Node.js**: Versão 18.0.0 ou superior (para desenvolvimento local)
- **Python**: Versão 3.10.0 ou superior (para desenvolvimento local)

### Instalação com Docker (Recomendado)

A maneira mais simples de implementar a NowGo Agents Platform é utilizando Docker e Docker Compose.

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Helioguilhermediassilva/nowgo-agents.git
   cd nowgo-agents
   ```

2. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```
   # Configurações do Banco de Dados
   DATABASE_URL=postgresql://postgres:postgres@db:5432/nowgo_agents
   
   # Configurações de Segurança
   SECRET_KEY=sua_chave_secreta_aqui
   JWT_SECRET=seu_jwt_secret_aqui
   
   # Configurações de API
   API_URL=http://localhost:8000
   
   # Configurações de Integração
   OPENAI_API_KEY=sua_chave_api_openai
   ```

3. **Inicie os serviços**:
   ```bash
   docker-compose up -d
   ```

4. **Verifique se os serviços estão funcionando**:
   ```bash
   docker-compose ps
   ```

5. **Acesse a aplicação**:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api/docs

### Instalação Manual

Se preferir uma instalação manual para desenvolvimento ou personalização avançada, siga estas etapas:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Helioguilhermediassilva/nowgo-agents.git
   cd nowgo-agents
   ```

2. **Configure o backend**:
   ```bash
   cd src
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   pip install -r ../requirements.txt
   cp ../.env.example ../.env
   ```
   
   Edite o arquivo `.env` com suas configurações.

3. **Inicie o banco de dados**:
   ```bash
   docker-compose up -d db redis
   ```

4. **Execute as migrações do banco de dados**:
   ```bash
   alembic upgrade head
   ```

5. **Inicie o backend**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

6. **Configure o frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

7. **Inicie o frontend**:
   ```bash
   npm run dev
   ```

8. **Acesse a aplicação**:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api/docs

### Configuração Inicial

Após a instalação, é necessário realizar algumas configurações iniciais:

1. **Crie um usuário administrador**:
   ```bash
   docker-compose exec backend python src/scripts/create_admin.py
   ```
   
   Ou, se estiver usando instalação manual:
   ```bash
   python src/scripts/create_admin.py
   ```

2. **Faça login na plataforma**:
   - Acesse http://localhost:3000/login
   - Use as credenciais do administrador criado no passo anterior

3. **Configure integrações**:
   - Acesse a seção de Configurações
   - Configure as integrações necessárias (WhatsApp, Email, etc.)

### Personalização

A NowGo Agents Platform foi projetada para ser altamente personalizável:

1. **Personalização de Temas**:
   - Edite o arquivo `frontend/tailwind.config.js` para personalizar cores e estilos
   - Atualize o arquivo `frontend/src/styles/globals.css` para ajustes adicionais

2. **Personalização de Agentes**:
   - Edite os templates de prompts em `src/services/agent_generator.py`
   - Adicione novos tipos de agentes em `src/models/organization_analyzer.py`

3. **Personalização de Fluxos**:
   - Modifique os fluxos de análise em `src/api/organization_routes.py`
   - Ajuste a lógica de geração de agentes em `src/api/agent_routes.py`

### Implantação em Produção

Para implantar a NowGo Agents Platform em um ambiente de produção, recomendamos:

1. **Infraestrutura**:
   - Utilize serviços gerenciados para banco de dados e cache
   - Configure balanceadores de carga para alta disponibilidade
   - Implemente CDN para conteúdo estático

2. **Segurança**:
   - Ative HTTPS com certificados válidos
   - Configure firewalls e grupos de segurança
   - Implemente monitoramento e alertas

3. **Escalabilidade**:
   - Configure auto-scaling para os serviços
   - Utilize réplicas para distribuir carga
   - Implemente estratégias de cache

4. **Monitoramento**:
   - Configure coleta de logs centralizada
   - Implemente dashboards de monitoramento
   - Configure alertas para eventos críticos

### Solução de Problemas

#### Problemas Comuns

1. **Erro de conexão com o banco de dados**:
   - Verifique se o serviço do banco de dados está em execução
   - Confirme se as credenciais no arquivo `.env` estão corretas
   - Verifique se as migrações foram aplicadas

2. **Erro de autenticação**:
   - Verifique se as chaves JWT estão configuradas corretamente
   - Confirme se o usuário administrador foi criado
   - Verifique os logs do backend para mensagens de erro específicas

3. **Problemas com geração de agentes**:
   - Verifique se a chave da API OpenAI está configurada
   - Confirme se os modelos de linguagem estão disponíveis
   - Verifique os logs para erros de integração

#### Logs e Diagnóstico

- **Logs do Backend**:
  ```bash
  docker-compose logs -f backend
  ```

- **Logs do Frontend**:
  ```bash
  docker-compose logs -f frontend
  ```

- **Verificação de Saúde da API**:
  ```bash
  curl http://localhost:8000/api/health
  ```

## English

### Introduction

This guide provides detailed instructions for implementing the NowGo Agents Platform, a complete solution for creating and managing autonomous agents for medium and large enterprises. The platform allows analyzing the specific needs of any organization and automatically generating personalized agents.

### Prerequisites

Before starting the implementation, make sure your environment meets the following requirements:

- **Operating System**: Linux (Ubuntu 20.04+ recommended), macOS, or Windows with WSL2
- **Docker**: Version 20.10.0 or higher
- **Docker Compose**: Version 2.0.0 or higher
- **Git**: Version 2.30.0 or higher
- **Node.js**: Version 18.0.0 or higher (for local development)
- **Python**: Version 3.10.0 or higher (for local development)

### Installation with Docker (Recommended)

The simplest way to implement the NowGo Agents Platform is using Docker and Docker Compose.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Helioguilhermediassilva/nowgo-agents.git
   cd nowgo-agents
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your settings:
   ```
   # Database Settings
   DATABASE_URL=postgresql://postgres:postgres@db:5432/nowgo_agents
   
   # Security Settings
   SECRET_KEY=your_secret_key_here
   JWT_SECRET=your_jwt_secret_here
   
   # API Settings
   API_URL=http://localhost:8000
   
   # Integration Settings
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Start the services**:
   ```bash
   docker-compose up -d
   ```

4. **Verify that the services are running**:
   ```bash
   docker-compose ps
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api/docs

### Manual Installation

If you prefer a manual installation for development or advanced customization, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Helioguilhermediassilva/nowgo-agents.git
   cd nowgo-agents
   ```

2. **Configure the backend**:
   ```bash
   cd src
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r ../requirements.txt
   cp ../.env.example ../.env
   ```
   
   Edit the `.env` file with your settings.

3. **Start the database**:
   ```bash
   docker-compose up -d db redis
   ```

4. **Run database migrations**:
   ```bash
   alembic upgrade head
   ```

5. **Start the backend**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

6. **Configure the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

7. **Start the frontend**:
   ```bash
   npm run dev
   ```

8. **Access the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api/docs

### Initial Configuration

After installation, some initial configurations are necessary:

1. **Create an admin user**:
   ```bash
   docker-compose exec backend python src/scripts/create_admin.py
   ```
   
   Or, if using manual installation:
   ```bash
   python src/scripts/create_admin.py
   ```

2. **Log in to the platform**:
   - Access http://localhost:3000/login
   - Use the admin credentials created in the previous step

3. **Configure integrations**:
   - Access the Settings section
   - Configure the necessary integrations (WhatsApp, Email, etc.)

### Customization

The NowGo Agents Platform was designed to be highly customizable:

1. **Theme Customization**:
   - Edit the `frontend/tailwind.config.js` file to customize colors and styles
   - Update the `frontend/src/styles/globals.css` file for additional adjustments

2. **Agent Customization**:
   - Edit prompt templates in `src/services/agent_generator.py`
   - Add new agent types in `src/models/organization_analyzer.py`

3. **Flow Customization**:
   - Modify analysis flows in `src/api/organization_routes.py`
   - Adjust agent generation logic in `src/api/agent_routes.py`

### Production Deployment

To deploy the NowGo Agents Platform in a production environment, we recommend:

1. **Infrastructure**:
   - Use managed services for database and cache
   - Configure load balancers for high availability
   - Implement CDN for static content

2. **Security**:
   - Enable HTTPS with valid certificates
   - Configure firewalls and security groups
   - Implement monitoring and alerts

3. **Scalability**:
   - Configure auto-scaling for services
   - Use replicas to distribute load
   - Implement caching strategies

4. **Monitoring**:
   - Configure centralized log collection
   - Implement monitoring dashboards
   - Configure alerts for critical events

### Troubleshooting

#### Common Issues

1. **Database connection error**:
   - Check if the database service is running
   - Confirm that the credentials in the `.env` file are correct
   - Verify that migrations have been applied

2. **Authentication error**:
   - Check if JWT keys are correctly configured
   - Confirm that the admin user was created
   - Check backend logs for specific error messages

3. **Issues with agent generation**:
   - Check if the OpenAI API key is configured
   - Confirm that language models are available
   - Check logs for integration errors

#### Logs and Diagnostics

- **Backend Logs**:
  ```bash
  docker-compose logs -f backend
  ```

- **Frontend Logs**:
  ```bash
  docker-compose logs -f frontend
  ```

- **API Health Check**:
  ```bash
  curl http://localhost:8000/api/health
  ```
