from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL connection string from user
# Note: Ensure psycopg2-binary is installed
SQLALCHEMY_DATABASE_URL = "postgresql://neondb_owner:npg_DhC2nsVrfA1t@ep-raspy-voice-ahirysd4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
