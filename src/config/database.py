"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: NowGo Holding                                                       │
│ @file: database.py                                                           │
│ Developed by: NowGo Holding AI Team                                          │
│ Creation date: May 30, 2025                                                  │
│ Contact: ai@nowgo.holding                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © NowGo Holding 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
└──────────────────────────────────────────────────────────────────────────────┘
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL from environment variable or default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nowgo_agents.db")

# Create engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
