# Configuração de Ambientes - NowGo Agents Platform

## Português

### Visão Geral

Este documento descreve a configuração dos ambientes de desenvolvimento, teste e produção para a NowGo Agents Platform. Ele fornece instruções detalhadas para configurar cada ambiente, garantindo consistência e confiabilidade em todo o ciclo de vida do desenvolvimento.

### Requisitos de Sistema

#### Hardware Recomendado
- **Desenvolvimento**: 4 vCPUs, 8GB RAM, 50GB SSD
- **Teste**: 8 vCPUs, 16GB RAM, 100GB SSD
- **Produção**: 16 vCPUs, 32GB RAM, 200GB SSD (escalável)

#### Software Necessário
- Docker e Docker Compose
- Git
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Nginx (para produção)

### Estrutura de Diretórios

```
nowgo-agents/
├── alembic/                # Migrações de banco de dados
├── docs/                   # Documentação
├── frontend/               # Aplicação frontend Next.js
├── scripts/                # Scripts de automação
├── src/                    # Código-fonte backend
│   ├── api/                # Endpoints da API
│   ├── config/             # Configurações
│   ├── models/             # Modelos de dados
│   ├── schemas/            # Esquemas Pydantic
│   ├── services/           # Serviços de negócios
│   └── scripts/            # Scripts utilitários
├── tests/                  # Testes automatizados
├── .env.example            # Exemplo de variáveis de ambiente
├── docker-compose.yml      # Configuração Docker para desenvolvimento
├── docker-compose.prod.yml # Configuração Docker para produção
└── requirements.txt        # Dependências Python
```

### Variáveis de Ambiente

A plataforma utiliza variáveis de ambiente para configuração. Abaixo estão as variáveis necessárias para cada ambiente:

#### Variáveis Comuns
```
# Configuração do Banco de Dados
DATABASE_URL=postgresql://user:password@db:5432/nowgo_agents
DATABASE_TEST_URL=postgresql://user:password@db:5432/nowgo_agents_test

# Configuração do Redis
REDIS_URL=redis://redis:6379/0

# Configuração de Segurança
SECRET_KEY=your_secret_key_here
JWT_SECRET=your_jwt_secret_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600

# Configuração de Logging
LOG_LEVEL=INFO
```

#### Variáveis Específicas de Ambiente

**Desenvolvimento**
```
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=http://localhost:3000
```

**Teste**
```
ENVIRONMENT=testing
DEBUG=false
CORS_ORIGINS=http://localhost:3000
```

**Produção**
```
ENVIRONMENT=production
DEBUG=false
CORS_ORIGINS=https://app.nowgo-agents.com
SENTRY_DSN=your_sentry_dsn
```

### Configuração do Ambiente de Desenvolvimento

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Helioguilhermediassilva/nowgo-agents.git
   cd nowgo-agents
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. **Inicie os serviços com Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Execute as migrações do banco de dados**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

5. **Crie um usuário administrador**
   ```bash
   docker-compose exec backend python src/scripts/create_admin.py
   ```

6. **Inicie o frontend em modo de desenvolvimento**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. **Acesse a aplicação**
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000
   - Documentação da API: http://localhost:8000/docs

### Configuração do Ambiente de Teste

1. **Configure as variáveis de ambiente para teste**
   ```bash
   cp .env.example .env.test
   # Edite o arquivo .env.test com configurações de teste
   ```

2. **Inicie os serviços de teste**
   ```bash
   docker-compose -f docker-compose.test.yml up -d
   ```

3. **Execute as migrações no banco de dados de teste**
   ```bash
   docker-compose -f docker-compose.test.yml exec backend alembic upgrade head
   ```

4. **Execute os testes automatizados**
   ```bash
   docker-compose -f docker-compose.test.yml exec backend pytest
   ```

5. **Execute testes de integração**
   ```bash
   docker-compose -f docker-compose.test.yml exec backend python src/scripts/test_api.py
   ```

6. **Execute testes de carga**
   ```bash
   docker-compose -f docker-compose.test.yml exec backend locust -f tests/locust/locustfile.py
   ```

### Configuração do Ambiente de Produção

1. **Prepare o servidor de produção**
   - Configure um servidor com os requisitos de hardware recomendados
   - Instale Docker e Docker Compose
   - Configure o firewall para permitir apenas as portas necessárias (80, 443)
   - Configure certificados SSL

2. **Configure as variáveis de ambiente para produção**
   ```bash
   cp .env.example .env.prod
   # Edite o arquivo .env.prod com configurações de produção seguras
   ```

3. **Implante a aplicação com Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Execute as migrações no banco de dados de produção**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
   ```

5. **Configure o Nginx como proxy reverso**
   ```nginx
   server {
       listen 80;
       server_name app.nowgo-agents.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name app.nowgo-agents.com;

       ssl_certificate /etc/letsencrypt/live/app.nowgo-agents.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/app.nowgo-agents.com/privkey.pem;

       location / {
           proxy_pass http://frontend:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://backend:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

6. **Configure backups automáticos**
   ```bash
   # Adicione ao crontab
   0 2 * * * /path/to/nowgo-agents/scripts/backup.sh
   ```

7. **Configure monitoramento**
   - Integre com Prometheus e Grafana
   - Configure alertas para métricas críticas

### Estratégia de Implantação

#### Implantação Contínua (CI/CD)

1. **Pipeline de Desenvolvimento**
   - Commit no branch de desenvolvimento
   - Execução de testes automatizados
   - Build de imagens Docker
   - Implantação no ambiente de desenvolvimento

2. **Pipeline de Homologação**
   - Merge request para o branch de homologação
   - Execução de testes de integração
   - Execução de testes de carga
   - Implantação no ambiente de homologação

3. **Pipeline de Produção**
   - Merge request para o branch principal
   - Execução de todos os testes
   - Build de imagens Docker com tags de versão
   - Implantação no ambiente de produção

#### Estratégia de Rollback

Em caso de problemas após a implantação:

1. **Rollback Rápido**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   # Altere a tag da imagem para a versão anterior
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Restauração de Banco de Dados**
   ```bash
   # Restaure o backup mais recente antes da implantação problemática
   scripts/restore_backup.sh backup_file.sql
   ```

### Monitoramento e Logging

#### Monitoramento

- **Métricas de Sistema**: CPU, memória, disco, rede
- **Métricas de Aplicação**: Tempo de resposta, taxa de erros, requisições por segundo
- **Métricas de Negócio**: Número de agentes ativos, análises organizacionais, interações

#### Logging

- **Logs de Aplicação**: Armazenados em `/var/log/nowgo-agents/`
- **Logs de Sistema**: Integrados com syslog
- **Logs de Auditoria**: Ações de usuários administrativos

#### Ferramentas Recomendadas

- **Monitoramento**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Rastreamento**: Jaeger (OpenTelemetry)
- **Alertas**: Alertmanager + PagerDuty

### Segurança

#### Práticas Recomendadas

1. **Atualizações Regulares**
   ```bash
   # Atualize dependências regularmente
   pip install --upgrade -r requirements.txt
   npm update
   ```

2. **Escaneamento de Vulnerabilidades**
   ```bash
   # Escaneie imagens Docker
   docker scan nowgo-agents-backend:latest
   docker scan nowgo-agents-frontend:latest
   ```

3. **Backup e Recuperação**
   ```bash
   # Backup diário do banco de dados
   pg_dump -U postgres nowgo_agents > /backups/nowgo_agents_$(date +%Y%m%d).sql
   ```

4. **Rotação de Segredos**
   - Rotacione chaves JWT a cada 90 dias
   - Utilize um gerenciador de segredos como HashiCorp Vault

## English

### Overview

This document describes the configuration of development, testing, and production environments for the NowGo Agents Platform. It provides detailed instructions for setting up each environment, ensuring consistency and reliability throughout the development lifecycle.

### System Requirements

#### Recommended Hardware
- **Development**: 4 vCPUs, 8GB RAM, 50GB SSD
- **Testing**: 8 vCPUs, 16GB RAM, 100GB SSD
- **Production**: 16 vCPUs, 32GB RAM, 200GB SSD (scalable)

#### Required Software
- Docker and Docker Compose
- Git
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Nginx (for production)

### Directory Structure

```
nowgo-agents/
├── alembic/                # Database migrations
├── docs/                   # Documentation
├── frontend/               # Next.js frontend application
├── scripts/                # Automation scripts
├── src/                    # Backend source code
│   ├── api/                # API endpoints
│   ├── config/             # Configurations
│   ├── models/             # Data models
│   ├── schemas/            # Pydantic schemas
│   ├── services/           # Business services
│   └── scripts/            # Utility scripts
├── tests/                  # Automated tests
├── .env.example            # Example environment variables
├── docker-compose.yml      # Docker configuration for development
├── docker-compose.prod.yml # Docker configuration for production
└── requirements.txt        # Python dependencies
```

### Environment Variables

The platform uses environment variables for configuration. Below are the variables needed for each environment:

#### Common Variables
```
# Database Configuration
DATABASE_URL=postgresql://user:password@db:5432/nowgo_agents
DATABASE_TEST_URL=postgresql://user:password@db:5432/nowgo_agents_test

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# Security Configuration
SECRET_KEY=your_secret_key_here
JWT_SECRET=your_jwt_secret_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600

# Logging Configuration
LOG_LEVEL=INFO
```

#### Environment-Specific Variables

**Development**
```
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=http://localhost:3000
```

**Testing**
```
ENVIRONMENT=testing
DEBUG=false
CORS_ORIGINS=http://localhost:3000
```

**Production**
```
ENVIRONMENT=production
DEBUG=false
CORS_ORIGINS=https://app.nowgo-agents.com
SENTRY_DSN=your_sentry_dsn
```

### Development Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Helioguilhermediassilva/nowgo-agents.git
   cd nowgo-agents
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit the .env file with your settings
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

5. **Create an admin user**
   ```bash
   docker-compose exec backend python src/scripts/create_admin.py
   ```

6. **Start the frontend in development mode**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. **Access the application**
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8000/docs

### Testing Environment Setup

1. **Set up environment variables for testing**
   ```bash
   cp .env.example .env.test
   # Edit the .env.test file with testing settings
   ```

2. **Start testing services**
   ```bash
   docker-compose -f docker-compose.test.yml up -d
   ```

3. **Run migrations on the test database**
   ```bash
   docker-compose -f docker-compose.test.yml exec backend alembic upgrade head
   ```

4. **Run automated tests**
   ```bash
   docker-compose -f docker-compose.test.yml exec backend pytest
   ```

5. **Run integration tests**
   ```bash
   docker-compose -f docker-compose.test.yml exec backend python src/scripts/test_api.py
   ```

6. **Run load tests**
   ```bash
   docker-compose -f docker-compose.test.yml exec backend locust -f tests/locust/locustfile.py
   ```

### Production Environment Setup

1. **Prepare the production server**
   - Set up a server with the recommended hardware requirements
   - Install Docker and Docker Compose
   - Configure the firewall to allow only necessary ports (80, 443)
   - Set up SSL certificates

2. **Set up environment variables for production**
   ```bash
   cp .env.example .env.prod
   # Edit the .env.prod file with secure production settings
   ```

3. **Deploy the application with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Run migrations on the production database**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
   ```

5. **Configure Nginx as a reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name app.nowgo-agents.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name app.nowgo-agents.com;

       ssl_certificate /etc/letsencrypt/live/app.nowgo-agents.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/app.nowgo-agents.com/privkey.pem;

       location / {
           proxy_pass http://frontend:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://backend:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

6. **Set up automatic backups**
   ```bash
   # Add to crontab
   0 2 * * * /path/to/nowgo-agents/scripts/backup.sh
   ```

7. **Set up monitoring**
   - Integrate with Prometheus and Grafana
   - Configure alerts for critical metrics

### Deployment Strategy

#### Continuous Deployment (CI/CD)

1. **Development Pipeline**
   - Commit to development branch
   - Run automated tests
   - Build Docker images
   - Deploy to development environment

2. **Staging Pipeline**
   - Merge request to staging branch
   - Run integration tests
   - Run load tests
   - Deploy to staging environment

3. **Production Pipeline**
   - Merge request to main branch
   - Run all tests
   - Build Docker images with version tags
   - Deploy to production environment

#### Rollback Strategy

In case of issues after deployment:

1. **Quick Rollback**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   # Change the image tag to the previous version
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Database Restoration**
   ```bash
   # Restore the most recent backup before the problematic deployment
   scripts/restore_backup.sh backup_file.sql
   ```

### Monitoring and Logging

#### Monitoring

- **System Metrics**: CPU, memory, disk, network
- **Application Metrics**: Response time, error rate, requests per second
- **Business Metrics**: Number of active agents, organizational analyses, interactions

#### Logging

- **Application Logs**: Stored in `/var/log/nowgo-agents/`
- **System Logs**: Integrated with syslog
- **Audit Logs**: Administrative user actions

#### Recommended Tools

- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger (OpenTelemetry)
- **Alerts**: Alertmanager + PagerDuty

### Security

#### Best Practices

1. **Regular Updates**
   ```bash
   # Update dependencies regularly
   pip install --upgrade -r requirements.txt
   npm update
   ```

2. **Vulnerability Scanning**
   ```bash
   # Scan Docker images
   docker scan nowgo-agents-backend:latest
   docker scan nowgo-agents-frontend:latest
   ```

3. **Backup and Recovery**
   ```bash
   # Daily database backup
   pg_dump -U postgres nowgo_agents > /backups/nowgo_agents_$(date +%Y%m%d).sql
   ```

4. **Secret Rotation**
   - Rotate JWT keys every 90 days
   - Use a secret manager like HashiCorp Vault
