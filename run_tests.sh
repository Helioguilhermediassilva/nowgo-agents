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
