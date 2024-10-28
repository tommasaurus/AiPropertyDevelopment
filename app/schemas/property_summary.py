# app/schemas/property_summary.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class PropertySummary(BaseModel):
    id: int
    address: str
    property_type: Optional[str] = None
    is_commercial: Optional[bool] = False

    class Config:
        from_attributes = True
