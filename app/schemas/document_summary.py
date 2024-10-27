# app/schemas/document_summary.py

from pydantic import BaseModel
from datetime import datetime

class DocumentSummary(BaseModel):
    id: int
    document_type: str    
    upload_date: datetime

    class Config:
        orm_mode = True