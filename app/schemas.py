# app/schemas.py
from pydantic import BaseModel
from typing import Optional

class PropertyRequest(BaseModel):
    address: str

class PropertyInfo(BaseModel):
    address: str
    property_type: Optional[str]
    price: Optional[float]
    lot_size: Optional[str]
    zoning_info: Optional[str]
    existing_structures: Optional[str]
    environmental_data: Optional[str]
    image_url: Optional[str]

    class Config:
        from_attributes = True  # Changed from 'orm_mode' to 'from_attributes'
