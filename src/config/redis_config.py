"""
Configuração do Redis para cache e filas de mensagens
"""

import os
import redis
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configuração do Redis
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

# Cliente Redis para cache
redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    password=REDIS_PASSWORD,
    decode_responses=True
)

# Função para obter cliente Redis
def get_redis_client():
    """
    Retorna o cliente Redis configurado.
    
    Returns:
        Cliente Redis
    """
    return redis_client

# Função para verificar conexão com Redis
def check_redis_connection():
    """
    Verifica se a conexão com o Redis está funcionando.
    
    Returns:
        True se a conexão estiver funcionando, False caso contrário
    """
    try:
        redis_client.ping()
        return True
    except Exception as e:
        print(f"Erro ao conectar ao Redis: {e}")
        return False
