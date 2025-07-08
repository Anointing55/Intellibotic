# backend/utils/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://intellibotic_user:vMJoq4OXxhqziEqt5LRHAOARZUOZ6im8@dpg-d1mgd23e5dus73bh0b4g-a/intellibotic"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=30,
    pool_recycle=3600
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
