# app/schemas/lease_summary.py

from pydantic import BaseModel
from datetime import date

class LeaseSummary(BaseModel):
    id: int
    lease_type: str
    start_date: date
    end_date: date
    is_active: bool

    class Config:
        from_attributes = True
