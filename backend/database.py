from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- DATABASE CONFIGURATION ---
# Use SQLite for local development
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# For Neon/Production (Original)
# SQLALCHEMY_DATABASE_URL = "postgresql://neondb_owner:npg_DhC2nsVrfA1t@ep-raspy-voice-ahirysd4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Note: check_same_thread=False is only required for SQLite.
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

