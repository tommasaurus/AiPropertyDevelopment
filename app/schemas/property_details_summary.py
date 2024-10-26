# app/schemas/property_details_summary.py

from pydantic import BaseModel
from typing import Optional

class PropertyDetailsSummary(BaseModel):
    id: int
    year_built: Optional[int] = None
    square_footage: Optional[float] = None
    lot_size: Optional[float] = None

    class Config:
        orm_mode = True