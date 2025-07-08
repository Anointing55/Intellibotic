from sqlalchemy import Column, String, JSON
from backend.utils.database import Base

class Feature(Base):
    __tablename__ = "features"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    node_type = Column(String, nullable=False)
    config = Column(JSON, nullable=False)
