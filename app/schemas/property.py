# app/schemas/property.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.property_details import PropertyDetails
from app.schemas.lease import Lease

class PropertyBase(BaseModel):
    owner_id: int
    address: str
    num_bedrooms: Optional[int] = None
    num_bathrooms: Optional[int] = None
    num_floors: Optional[int] = None
    is_commercial: Optional[bool] = False
    is_hoa: Optional[bool] = False
    hoa_fee: Optional[float] = None
    is_nnn: Optional[bool] = False
    purchase_price: Optional[float] = None
    purchase_date: Optional[date] = None
    property_type: Optional[str] = None

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    owner_id: Optional[int] = None
    address: Optional[str] = None
    num_bedrooms: Optional[int] = None
    num_bathrooms: Optional[int] = None
    num_floors: Optional[int] = None
    is_commercial: Optional[bool] = None
    is_hoa: Optional[bool] = None
    hoa_fee: Optional[float] = None
    is_nnn: Optional[bool] = None
    purchase_price: Optional[float] = None
    purchase_date: Optional[date] = None
    property_type: Optional[str] = None

class PropertyInDBBase(PropertyBase):
    id: int

    class Config:
        orm_mode = True

class Property(PropertyInDBBase):
    property_details: Optional[PropertyDetails] = None
    leases: Optional[List[Lease]] = []
