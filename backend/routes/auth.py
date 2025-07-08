from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from backend.utils.auth import create_access_token

router = APIRouter()

class User(BaseModel):
    full_name: str
    password: str

HARDCODED_USER = User(full_name="Anointing Omowumi", password="Ayobami55")

@router.post("/api/login")
async def login(user: User):
    if user.full_name != HARDCODED_USER.full_name or user.password != HARDCODED_USER.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.full_name})
    return {"access_token": access_token, "token_type": "bearer"}
