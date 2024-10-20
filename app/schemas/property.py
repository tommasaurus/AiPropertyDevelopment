# app/schemas/property.py

from pydantic import BaseModel
from typing import Optional

class PropertyBase(BaseModel):
    address: str
    num_bedrooms: Optional[int] = None
    num_bathrooms: Optional[int] = None
    num_floors: Optional[int] = None
    is_commercial: Optional[bool] = False
    is_hoa: Optional[bool] = False
    hoa_fee: Optional[float] = None
    is_nnn: Optional[bool] = False
    purchase_price: Optional[float] = None
    purchase_date: Optional[str] = None  # Use datetime/date types as appropriate
    property_type: Optional[str] = None

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(PropertyBase):
    pass

class PropertyInDBBase(PropertyBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class Property(PropertyInDBBase):
    pass
