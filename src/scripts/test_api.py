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
