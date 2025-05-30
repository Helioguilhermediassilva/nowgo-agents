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
