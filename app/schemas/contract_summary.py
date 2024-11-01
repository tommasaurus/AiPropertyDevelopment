# app/schemas/contract_summary.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class ContractSummary(BaseModel):
    id: int
    contract_type: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: bool

    class Config:
        from_attributes = True
