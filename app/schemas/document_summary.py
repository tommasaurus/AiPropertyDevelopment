# app/schemas/document_summary.py

from pydantic import BaseModel
from datetime import datetime

class DocumentSummary(BaseModel):
    id: int
    document_type: str
    file_url: str
    upload_date: datetime

    class Config:
        orm_mode = True