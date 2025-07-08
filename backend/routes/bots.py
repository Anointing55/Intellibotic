# backend/routes/bots.py
import os
import json
import re
from pathlib import Path
from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from backend.utils.database import get_db
from backend.models.bot import Bot
from backend.utils.auth import verify_token

router = APIRouter()

# Create bots directory if not exists
bots_dir = Path("backend/bots")
bots_dir.mkdir(parents=True, exist_ok=True)

# Pydantic models
class BotCreate(BaseModel):
    name: str
    description: Optional[str] = None
    config: dict

class BotUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[dict] = None

class BotResponse(BotCreate):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

# Sanitize filename
def sanitize_filename(name: str) -> str:
    return re.sub(r'[^a-zA-Z0-9_-]', '', name).lower()

# Save bot to JSON file
def save_bot_to_json(bot_id: int, bot_name: str, config: dict):
    filename = sanitize_filename(f"{bot_id}_{bot_name}")
    filepath = bots_dir / f"{filename}.json"
    with open(filepath, 'w') as f:
        json.dump(config, f, indent=2)
    return filepath

# Delete bot JSON file
def delete_bot_json(bot_id: int, bot_name: str):
    filename = sanitize_filename(f"{bot_id}_{bot_name}")
    filepath = bots_dir / f"{filename}.json"
    if filepath.exists():
        filepath.unlink()

# Routes
@router.post("/", response_model=BotResponse)
def create_bot(
    bot: BotCreate, 
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    # Check if bot name exists
    existing_bot = db.query(Bot).filter(Bot.name == bot.name).first()
    if existing_bot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bot name already exists"
        )
    
    # Create bot in database
    db_bot = Bot(name=bot.name, description=bot.description, config=bot.config)
    db.add(db_bot)
    db.commit()
    db.refresh(db_bot)
    
    # Save to JSON file
    save_bot_to_json(db_bot.id, db_bot.name, db_bot.config)
    
    return db_bot

@router.get("/", response_model=List[BotResponse])
def list_bots(
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    return db.query(Bot).all()

@router.get("/{bot_id}", response_model=BotResponse)
def get_bot(
    bot_id: int, 
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bot not found"
        )
    return bot

@router.put("/{bot_id}", response_model=BotResponse)
def update_bot(
    bot_id: int, 
    bot_data: BotUpdate, 
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bot not found"
        )
    
    # Update fields
    if bot_data.name is not None:
        # Check if new name exists
        if bot_data.name != bot.name:
            existing_bot = db.query(Bot).filter(Bot.name == bot_data.name).first()
            if existing_bot:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Bot name already exists"
                )
        bot.name = bot_data.name
    
    if bot_data.description is not None:
        bot.description = bot_data.description
    
    if bot_data.config is not None:
        bot.config = bot_data.config
    
    bot.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(bot)
    
    # Update JSON file
    delete_bot_json(bot_id, bot.name)  # Delete old file
    save_bot_to_json(bot.id, bot.name, bot.config)
    
    return bot

@router.delete("/{bot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bot(
    bot_id: int, 
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bot not found"
        )
    
    # Delete JSON file
    delete_bot_json(bot_id, bot.name)
    
    # Delete from database
    db.delete(bot)
    db.commit()
    return

@router.post("/{bot_id}/export", response_model=dict)
def export_bot(
    bot_id: int, 
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bot not found"
        )
    
    # Return bot config for export
    return {
        "id": bot.id,
        "name": bot.name,
        "description": bot.description,
        "config": bot.config,
        "created_at": bot.created_at.isoformat(),
        "updated_at": bot.updated_at.isoformat() if bot.updated_at else None
    }

@router.post("/import", response_model=BotResponse)
def import_bot(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    try:
        # Read and parse uploaded file
        content = file.file.read().decode('utf-8')
        bot_data = json.loads(content)
        
        # Validate structure
        required_fields = ["name", "config"]
        if not all(field in bot_data for field in required_fields):
            raise ValueError("Invalid bot import format")
        
        # Create bot from imported data
        bot_create = BotCreate(
            name=bot_data["name"],
            description=bot_data.get("description"),
            config=bot_data["config"]
        )
        
        return create_bot(bot_create, db, username)
    
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON format"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error importing bot: {str(e)}"
        )
