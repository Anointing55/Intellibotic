# backend/main.py
import os
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Optional
from backend.routes import auth, bots

# Environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://intellibotic_user:vMJoq4OXxhqziEqt5LRHAOARZUOZ6im8@dpg-d1mgd23e5dus73bh0b4g-a/intellibotic")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "intellibotic_secret_key_123")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Hardcoded credentials
HARDCODED_USERNAME = "Anointing Omowumi"
HARDCODED_PASSWORD = "Ayobami55"

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str

# Password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# FastAPI app
app = FastAPI(
    title="Intellibotic API",
    description="Backend for Intellibotic chatbot platform",
    version="0.1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str):
    if username != HARDCODED_USERNAME:
        return False
    if password != HARDCODED_PASSWORD:
        return False
    return User(username=username)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = authenticate_user(token_data.username, "")
    if user is None:
        raise credentials_exception
    return user

# API endpoints
@app.post("/api/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Backend is working!", "status": "success"}

# Serve React frontend
app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")

# Catch-all route for React Router
@app.exception_handler(404)
async def catch_all(request: Request, exc: HTTPException):
    return FileResponse("frontend/build/index.html")

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(bots.router, prefix="/api/bots")

