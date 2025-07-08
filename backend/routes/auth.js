# backend/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from backend.utils import auth
from pydantic import BaseModel

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = auth.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: str = Depends(auth.verify_token)):
    return {"username": current_user}
