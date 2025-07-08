from fastapi import APIRouter, HTTPException, Depends
from backend.models.bot import Bot
from backend.utils.database import database
from backend.utils.auth import verify_token
from datetime import datetime
import uuid
import json
import os

router = APIRouter()

@router.get("/api/bots")
async def get_bots(token: dict = Depends(verify_token)):
    query = Bot.select()
    return await database.fetch_all(query)

@router.post("/api/bots")
async def create_bot(bot: dict, token: dict = Depends(verify_token)):
    bot_id = str(uuid.uuid4())
    now = datetime.now()
    
    # Save to database
    query = Bot.insert().values(
        id=bot_id,
        name=bot["name"],
        description=bot.get("description", ""),
        created_at=now,
        updated_at=now,
        flow_data=bot["flow_data"]
    )
    await database.execute(query)
    
    # Save to JSON file
    os.makedirs("backend/bots", exist_ok=True)
    with open(f"backend/bots/{bot['name']}.json", "w") as f:
        json.dump({**bot, "id": bot_id, "created_at": now.isoformat(), "updated_at": now.isoformat()}, f)
    
    return {"id": bot_id, **bot}
