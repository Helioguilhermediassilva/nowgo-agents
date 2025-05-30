"""
Configuração do OpenTelemetry para observabilidade da aplicação
"""

import os
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.instrumentation.langchain import LangChainInstrumentor
from opentelemetry.instrumentation.langfuse import LangfuseInstrumentor
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configuração do recurso OpenTelemetry
resource = Resource(attributes={
    SERVICE_NAME: "nowgo-agents-platform"
})

# Configuração do provedor de tracer
def setup_tracing(app=None, engine=None):
    """
    Configura o rastreamento OpenTelemetry para a aplicação.
    
    Args:
        app: Instância FastAPI (opcional)
        engine: Engine SQLAlchemy (opcional)
    """
    # Obter URL do coletor OTLP
    otlp_endpoint = os.getenv("OTLP_ENDPOINT", "http://localhost:4317")
    
    # Configurar provedor de tracer
    trace.set_tracer_provider(TracerProvider(resource=resource))
    
    # Configurar exportador OTLP
    otlp_exporter = OTLPSpanExporter(endpoint=otlp_endpoint)
    span_processor = BatchSpanProcessor(otlp_exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)
    
    # Instrumentar bibliotecas
    RequestsInstrumentor().instrument()
    
    # Instrumentar LangChain se disponível
    try:
        LangChainInstrumentor().instrument()
    except Exception as e:
        print(f"Erro ao instrumentar LangChain: {e}")
    
    # Instrumentar Langfuse se disponível
    try:
        LangfuseInstrumentor().instrument()
    except Exception as e:
        print(f"Erro ao instrumentar Langfuse: {e}")
    
    # Instrumentar FastAPI se fornecido
    if app:
        FastAPIInstrumentor.instrument_app(app)
    
    # Instrumentar SQLAlchemy se fornecido
    if engine:
        SQLAlchemyInstrumentor().instrument(engine=engine)
    
    # Instrumentar Redis se disponível
    try:
        RedisInstrumentor().instrument()
    except Exception as e:
        print(f"Erro ao instrumentar Redis: {e}")
    
    return trace.get_tracer("nowgo-agents-platform")
