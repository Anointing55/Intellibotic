# backend/utils/auth.py
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional

# Hardcoded credentials
HARDCODED_USERNAME = "Anointing Omowumi"
HARDCODED_PASSWORD = "Ayobami55"

# JWT Configuration
JWT_SECRET_KEY = "intellibotic_secret_key_123"
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hashed version."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a bcrypt hash for a password."""
    return pwd_context.hash(password)

def authenticate_user(username: str, password: str) -> bool:
    """Authenticate user with hardcoded credentials."""
    if username != HARDCODED_USERNAME:
        return False
    if not verify_password(password, get_password_hash(HARDCODED_PASSWORD)):
        return False
    return True

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def verify_token(token: str = Depends(oauth2_scheme)) -> str:
    """Verify JWT token and return username."""
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
        return username
    except JWTError:
        raise credentials_exception
