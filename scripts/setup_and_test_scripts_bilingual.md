# Scripts de Configuração e Testes - NowGo Agents Platform

## Português

### Scripts de Configuração

#### `setup_environment.sh`

```bash
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
```

#### `create_admin.py`

```python
#!/usr/bin/env python3

"""
Script para criar um cliente e usuário administrador na NowGo Agents Platform.
"""

import os
import sys
import argparse
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# Adicionar diretório src ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.config.database import get_db, engine
from src.models.models import Base, Client, User

# Criar tabelas se não existirem
Base.metadata.create_all(bind=engine)

# Contexto de criptografia para senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    """Gera hash da senha."""
    return pwd_context.hash(password)

def create_admin(name, email, password):
    """Cria um cliente e usuário administrador."""
    db = next(get_db())
    
    # Verificar se o cliente já existe
    client = db.query(Client).filter(Client.name == name).first()
    
    if not client:
        # Criar cliente
        client = Client(
            name=name,
            active=True
        )
        db.add(client)
        db.commit()
        db.refresh(client)
        print(f"Cliente '{name}' criado com ID {client.id}")
    else:
        print(f"Cliente '{name}' já existe com ID {client.id}")
    
    # Verificar se o usuário já existe
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Criar usuário administrador
        hashed_password = get_password_hash(password)
        user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=f"Admin {name}",
            client_id=client.id,
            is_admin=True,
            active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Usuário administrador '{email}' criado com ID {user.id}")
    else:
        print(f"Usuário '{email}' já existe com ID {user.id}")
    
    return client, user

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Criar cliente e usuário administrador")
    parser.add_argument("--name", default="NowGo Holding", help="Nome do cliente")
    parser.add_argument("--email", default="admin@nowgo.com", help="Email do administrador")
    parser.add_argument("--password", default="admin123", help="Senha do administrador")
    
    args = parser.parse_args()
    
    client, user = create_admin(args.name, args.email, args.password)
    
    print("\nCredenciais de acesso:")
    print(f"Email: {args.email}")
    print(f"Senha: {args.password}")
    print("\nUtilize estas credenciais para fazer login na plataforma.")
```

### Scripts de Teste

#### `run_tests.sh`

```bash
#!/bin/bash

# Script para executar testes da NowGo Agents Platform

echo "Executando testes da NowGo Agents Platform..."

# Ativar ambiente virtual
source venv/bin/activate

# Executar testes de backend
echo "Executando testes de backend..."
cd src
pytest -v

# Executar testes de frontend
echo "Executando testes de frontend..."
cd ../frontend
npm test

echo "Todos os testes concluídos!"
```

#### `test_api.py`

```python
#!/usr/bin/env python3

"""
Script para testar a API da NowGo Agents Platform.
"""

import requests
import json
import sys
import argparse
from time import sleep

def test_api(base_url, email, password):
    """Testa os principais endpoints da API."""
    print(f"Testando API em {base_url}")
    
    # Obter token de acesso
    print("\n1. Obtendo token de acesso...")
    token_response = requests.post(
        f"{base_url}/api/auth/token",
        data={"username": email, "password": password}
    )
    
    if token_response.status_code != 200:
        print(f"Erro ao obter token: {token_response.status_code}")
        print(token_response.text)
        sys.exit(1)
    
    token_data = token_response.json()
    access_token = token_data["access_token"]
    client_id = token_data["client_id"]
    
    print(f"Token obtido com sucesso para cliente ID {client_id}")
    
    # Configurar headers de autenticação
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # Criar perfil organizacional
    print("\n2. Criando perfil organizacional...")
    profile_data = {
        "client_id": client_id,
        "name": "NowGo Holding",
        "industry": "Tecnologia",
        "size": "medium",
        "description": "Empresa de tecnologia focada em soluções de IA",
        "primary_language": "pt",
        "supported_languages": ["pt", "en", "es"],
        "communication_channels": ["whatsapp", "email", "phone", "linkedin"],
        "crm_integration": True
    }
    
    profile_response = requests.post(
        f"{base_url}/api/organizations/profiles/",
        headers=headers,
        json=profile_data
    )
    
    if profile_response.status_code not in [200, 201, 409]:
        print(f"Erro ao criar perfil: {profile_response.status_code}")
        print(profile_response.text)
        sys.exit(1)
    
    if profile_response.status_code == 409:
        print("Perfil já existe, obtendo perfil existente...")
        profiles_response = requests.get(
            f"{base_url}/api/organizations/profiles/client/{client_id}",
            headers=headers
        )
        profile_id = profiles_response.json()[0]["id"]
    else:
        profile_id = profile_response.json()["id"]
    
    print(f"Perfil organizacional criado/obtido com ID {profile_id}")
    
    # Executar análise organizacional
    print("\n3. Executando análise organizacional...")
    analysis_response = requests.post(
        f"{base_url}/api/organizations/profiles/{profile_id}/analyze",
        headers=headers
    )
    
    if analysis_response.status_code != 200:
        print(f"Erro ao executar análise: {analysis_response.status_code}")
        print(analysis_response.text)
        sys.exit(1)
    
    analysis_data = analysis_response.json()
    print(f"Análise executada com sucesso, ID: {analysis_data['analysis_id']}")
    print(f"Agentes recomendados: {len(analysis_data['recommended_agents'])}")
    
    # Gerar agentes
    print("\n4. Gerando agentes...")
    agent_templates = []
    
    for agent in analysis_data["recommended_agents"]:
        template = {
            "template_id": agent["template_id"],
            "custom_configuration": {
                "name": agent["name"],
                "description": agent["description"],
                **agent["recommended_configuration"]
            }
        }
        agent_templates.append(template)
    
    generation_response = requests.post(
        f"{base_url}/api/organizations/profiles/{profile_id}/generate-agents",
        headers=headers,
        json={"agent_templates": agent_templates}
    )
    
    if generation_response.status_code != 200:
        print(f"Erro ao gerar agentes: {generation_response.status_code}")
        print(generation_response.text)
        sys.exit(1)
    
    job_id = generation_response.json()["job_id"]
    print(f"Job de geração iniciado com ID {job_id}")
    
    # Verificar status do job
    print("\n5. Verificando status do job...")
    max_attempts = 10
    attempt = 0
    
    while attempt < max_attempts:
        attempt += 1
        sleep(2)  # Aguardar 2 segundos entre verificações
        
        job_response = requests.get(
            f"{base_url}/api/organizations/generation-jobs/{job_id}",
            headers=headers
        )
        
        if job_response.status_code != 200:
            print(f"Erro ao verificar job: {job_response.status_code}")
            print(job_response.text)
            sys.exit(1)
        
        job_data = job_response.json()
        status = job_data["status"]
        
        print(f"Status do job: {status}")
        
        if status == "completed":
            print(f"Agentes gerados: {len(job_data['generated_agents'])}")
            break
        elif status == "failed":
            print("Falha na geração de agentes")
            sys.exit(1)
    
    print("\nTestes de API concluídos com sucesso!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Testar API da NowGo Agents Platform")
    parser.add_argument("--url", default="http://localhost:8000", help="URL base da API")
    parser.add_argument("--email", default="admin@nowgo.com", help="Email do administrador")
    parser.add_argument("--password", default="admin123", help="Senha do administrador")
    
    args = parser.parse_args()
    
    test_api(args.url, args.email, args.password)
```

## English

### Configuration Scripts

#### `setup_environment.sh`

```bash
#!/bin/bash

# Script to set up the development environment for NowGo Agents Platform

echo "Setting up development environment for NowGo Agents Platform..."

# Check dependencies
echo "Checking dependencies..."
command -v python3 >/dev/null 2>&1 || { echo "Python 3 not found. Please install it."; exit 1; }
command -v pip3 >/dev/null 2>&1 || { echo "Pip not found. Please install it."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js not found. Please install it."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "NPM not found. Please install it."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker not found. Please install it."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose not found. Please install it."; exit 1; }

# Create Python virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Configure environment variables
echo "Configuring environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created. Please edit it with your settings."
fi

# Set up database
echo "Setting up database..."
docker-compose up -d db redis

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Set up frontend
echo "Setting up frontend..."
cd frontend
npm install
cd ..

echo "Development environment successfully configured!"
echo "To start the backend: cd src && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo "To start the frontend: cd frontend && npm run dev"
```

#### `create_admin.py`

```python
#!/usr/bin/env python3

"""
Script to create a client and admin user in the NowGo Agents Platform.
"""

import os
import sys
import argparse
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.config.database import get_db, engine
from src.models.models import Base, Client, User

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Password encryption context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    """Generate password hash."""
    return pwd_context.hash(password)

def create_admin(name, email, password):
    """Create a client and admin user."""
    db = next(get_db())
    
    # Check if client already exists
    client = db.query(Client).filter(Client.name == name).first()
    
    if not client:
        # Create client
        client = Client(
            name=name,
            active=True
        )
        db.add(client)
        db.commit()
        db.refresh(client)
        print(f"Client '{name}' created with ID {client.id}")
    else:
        print(f"Client '{name}' already exists with ID {client.id}")
    
    # Check if user already exists
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create admin user
        hashed_password = get_password_hash(password)
        user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=f"Admin {name}",
            client_id=client.id,
            is_admin=True,
            active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Admin user '{email}' created with ID {user.id}")
    else:
        print(f"User '{email}' already exists with ID {user.id}")
    
    return client, user

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create client and admin user")
    parser.add_argument("--name", default="NowGo Holding", help="Client name")
    parser.add_argument("--email", default="admin@nowgo.com", help="Admin email")
    parser.add_argument("--password", default="admin123", help="Admin password")
    
    args = parser.parse_args()
    
    client, user = create_admin(args.name, args.email, args.password)
    
    print("\nAccess credentials:")
    print(f"Email: {args.email}")
    print(f"Password: {args.password}")
    print("\nUse these credentials to log in to the platform.")
```

### Test Scripts

#### `run_tests.sh`

```bash
#!/bin/bash

# Script to run tests for the NowGo Agents Platform

echo "Running tests for NowGo Agents Platform..."

# Activate virtual environment
source venv/bin/activate

# Run backend tests
echo "Running backend tests..."
cd src
pytest -v

# Run frontend tests
echo "Running frontend tests..."
cd ../frontend
npm test

echo "All tests completed!"
```

#### `test_api.py`

```python
#!/usr/bin/env python3

"""
Script to test the NowGo Agents Platform API.
"""

import requests
import json
import sys
import argparse
from time import sleep

def test_api(base_url, email, password):
    """Test the main API endpoints."""
    print(f"Testing API at {base_url}")
    
    # Get access token
    print("\n1. Getting access token...")
    token_response = requests.post(
        f"{base_url}/api/auth/token",
        data={"username": email, "password": password}
    )
    
    if token_response.status_code != 200:
        print(f"Error getting token: {token_response.status_code}")
        print(token_response.text)
        sys.exit(1)
    
    token_data = token_response.json()
    access_token = token_data["access_token"]
    client_id = token_data["client_id"]
    
    print(f"Token successfully obtained for client ID {client_id}")
    
    # Configure authentication headers
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # Create organizational profile
    print("\n2. Creating organizational profile...")
    profile_data = {
        "client_id": client_id,
        "name": "NowGo Holding",
        "industry": "Technology",
        "size": "medium",
        "description": "Technology company focused on AI solutions",
        "primary_language": "pt",
        "supported_languages": ["pt", "en", "es"],
        "communication_channels": ["whatsapp", "email", "phone", "linkedin"],
        "crm_integration": True
    }
    
    profile_response = requests.post(
        f"{base_url}/api/organizations/profiles/",
        headers=headers,
        json=profile_data
    )
    
    if profile_response.status_code not in [200, 201, 409]:
        print(f"Error creating profile: {profile_response.status_code}")
        print(profile_response.text)
        sys.exit(1)
    
    if profile_response.status_code == 409:
        print("Profile already exists, getting existing profile...")
        profiles_response = requests.get(
            f"{base_url}/api/organizations/profiles/client/{client_id}",
            headers=headers
        )
        profile_id = profiles_response.json()[0]["id"]
    else:
        profile_id = profile_response.json()["id"]
    
    print(f"Organizational profile created/obtained with ID {profile_id}")
    
    # Run organizational analysis
    print("\n3. Running organizational analysis...")
    analysis_response = requests.post(
        f"{base_url}/api/organizations/profiles/{profile_id}/analyze",
        headers=headers
    )
    
    if analysis_response.status_code != 200:
        print(f"Error running analysis: {analysis_response.status_code}")
        print(analysis_response.text)
        sys.exit(1)
    
    analysis_data = analysis_response.json()
    print(f"Analysis successfully executed, ID: {analysis_data['analysis_id']}")
    print(f"Recommended agents: {len(analysis_data['recommended_agents'])}")
    
    # Generate agents
    print("\n4. Generating agents...")
    agent_templates = []
    
    for agent in analysis_data["recommended_agents"]:
        template = {
            "template_id": agent["template_id"],
            "custom_configuration": {
                "name": agent["name"],
                "description": agent["description"],
                **agent["recommended_configuration"]
            }
        }
        agent_templates.append(template)
    
    generation_response = requests.post(
        f"{base_url}/api/organizations/profiles/{profile_id}/generate-agents",
        headers=headers,
        json={"agent_templates": agent_templates}
    )
    
    if generation_response.status_code != 200:
        print(f"Error generating agents: {generation_response.status_code}")
        print(generation_response.text)
        sys.exit(1)
    
    job_id = generation_response.json()["job_id"]
    print(f"Generation job started with ID {job_id}")
    
    # Check job status
    print("\n5. Checking job status...")
    max_attempts = 10
    attempt = 0
    
    while attempt < max_attempts:
        attempt += 1
        sleep(2)  # Wait 2 seconds between checks
        
        job_response = requests.get(
            f"{base_url}/api/organizations/generation-jobs/{job_id}",
            headers=headers
        )
        
        if job_response.status_code != 200:
            print(f"Error checking job: {job_response.status_code}")
            print(job_response.text)
            sys.exit(1)
        
        job_data = job_response.json()
        status = job_data["status"]
        
        print(f"Job status: {status}")
        
        if status == "completed":
            print(f"Agents generated: {len(job_data['generated_agents'])}")
            break
        elif status == "failed":
            print("Agent generation failed")
            sys.exit(1)
    
    print("\nAPI tests completed successfully!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test NowGo Agents Platform API")
    parser.add_argument("--url", default="http://localhost:8000", help="API base URL")
    parser.add_argument("--email", default="admin@nowgo.com", help="Admin email")
    parser.add_argument("--password", default="admin123", help="Admin password")
    
    args = parser.parse_args()
    
    test_api(args.url, args.email, args.password)
```
