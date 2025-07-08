import databases
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/intellibotic")

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()
Base = declarative_base()

async def connect_db():
    await database.connect()

async def disconnect_db():
    await database.disconnect()
