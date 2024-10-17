# models/shared/Communications.py

from pydantic import BaseModel
from typing import List
from datetime import datetime

class Message(BaseModel):
    sender_id: int
    receiver_id: int
    timestamp: datetime
    content: str

class CommunicationThread(BaseModel):
    participants: List[int]  # User IDs
    messages: List[Message] = []

    def send_message(self, message: Message):
        self.messages.append(message)
