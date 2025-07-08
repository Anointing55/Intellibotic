# backend/models/bot.py
from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from backend.utils.database import Base

class Bot(Base):
    __tablename__ = "bots"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    config = Column(JSON, nullable=False, default={})
    
    def __repr__(self):
        return f"<Bot(name='{self.name}', created_at={self.created_at})>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "config": self.config
        }
