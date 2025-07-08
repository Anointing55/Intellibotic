import os
import json
import uuid
from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
import databases
import sqlalchemy

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/intellibotic")
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# SQLAlchemy models
bots = sqlalchemy.Table(
    "bots",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("name", sqlalchemy.String),
    sqlalchemy.Column("description", sqlalchemy.String),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime),
    sqlalchemy.Column("updated_at", sqlalchemy.DateTime),
    sqlalchemy.Column("flow_data", sqlalchemy.JSON),
)

features = sqlalchemy.Table(
    "features",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("name", sqlalchemy.String),
    sqlalchemy.Column("node_type", sqlalchemy.String),
    sqlalchemy.Column("config", sqlalchemy.JSON),
)

engine = sqlalchemy.create_engine(DATABASE_URL)
metadata.create_all(engine)

# Pydantic models
class BotBase(BaseModel):
    name: str
    description: Optional[str] = None
    flow_data: dict

class BotDB(BotBase):
    id: str
    created_at: datetime
    updated_at: datetime

class FeatureBase(BaseModel):
    name: str
    node_type: str
    config: dict

class FeatureDB(FeatureBase):
    id: str

class User(BaseModel):
    full_name: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Hardcoded credentials
HARDCODED_USER = User(full_name="Anointing Omowumi", password="Ayobami55")
SECRET_KEY = "intellibotic_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(title="Intellibotic API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

# Database connection
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# API Endpoints
@app.post("/api/login", response_model=Token)
async def login(user: User):
    if user.full_name != HARDCODED_USER.full_name or user.password != HARDCODED_USER.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.full_name})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/bots", response_model=List[BotDB])
async def read_bots(current_user: str = Depends(get_current_user)):
    query = bots.select()
    return await database.fetch_all(query)

@app.post("/api/bots", response_model=BotDB)
async def create_bot(bot: BotBase, current_user: str = Depends(get_current_user)):
    bot_id = str(uuid.uuid4())
    now = datetime.now()
    
    # Save to database
    query = bots.insert().values(
        id=bot_id,
        name=bot.name,
        description=bot.description,
        created_at=now,
        updated_at=now,
        flow_data=bot.flow_data
    )
    await database.execute(query)
    
    # Save to JSON file
    os.makedirs("backend/bots", exist_ok=True)
    with open(f"backend/bots/{bot.name}.json", "w") as f:
        json.dump({**bot.dict(), "id": bot_id, "created_at": now.isoformat(), "updated_at": now.isoformat()}, f)
    
    return {**bot.dict(), "id": bot_id, "created_at": now, "updated_at": now}

@app.post("/api/import-bot")
async def import_bot(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    contents = await file.read()
    bot_data = json.loads(contents)
    
    # Save to database
    bot_id = str(uuid.uuid4())
    now = datetime.now()
    query = bots.insert().values(
        id=bot_id,
        name=bot_data["name"],
        description=bot_data.get("description", ""),
        created_at=now,
        updated_at=now,
        flow_data=bot_data["flow_data"]
    )
    await database.execute(query)
    
    # Save to JSON file
    with open(f"backend/bots/{bot_data['name']}.json", "w") as f:
        json.dump({**bot_data, "id": bot_id, "created_at": now.isoformat(), "updated_at": now.isoformat()}, f)
    
    return {"status": "success", "bot_id": bot_id}

# Serve React frontend
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
