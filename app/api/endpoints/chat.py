from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class ChatMessage(BaseModel):
    message: str

@router.post("/echo")
async def echo_message(chat_message: ChatMessage, current_user: User = Depends(get_current_user)):
    response = f"{chat_message.message} echo"
    return {"response": response}
