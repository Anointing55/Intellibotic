from sqlalchemy import Column, String, JSON, DateTime
from backend.utils.database import Base

class Bot(Base):
    __tablename__ = "bots"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    flow_data = Column(JSON, nullable=False)
