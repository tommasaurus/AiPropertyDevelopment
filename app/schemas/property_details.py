# app/schemas/property_details.py

from pydantic import BaseModel
from typing import Optional, List
from app.schemas.utility_summary import UtilitySummary
from app.schemas.property_summary import PropertySummary

class PropertyDetailsBase(BaseModel):
    property_id: int
    year_built: Optional[int] = None
    square_footage: Optional[float] = None
    lot_size: Optional[float] = None
    zoning: Optional[str] = None
    tax_assessed_value: Optional[float] = None
    insurance_policy_number: Optional[str] = None
    hoa_name: Optional[str] = None
    hoa_contact: Optional[str] = None
    hoa_phone: Optional[str] = None
    hoa_email: Optional[str] = None
    hoa_website: Optional[str] = None

class PropertyDetailsCreate(PropertyDetailsBase):
    pass

class PropertyDetailsUpdate(BaseModel):
    year_built: Optional[int] = None
    square_footage: Optional[float] = None
    lot_size: Optional[float] = None
    zoning: Optional[str] = None
    tax_assessed_value: Optional[float] = None
    insurance_policy_number: Optional[str] = None
    hoa_name: Optional[str] = None
    hoa_contact: Optional[str] = None
    hoa_phone: Optional[str] = None
    hoa_email: Optional[str] = None
    hoa_website: Optional[str] = None

class PropertyDetailsInDBBase(PropertyDetailsBase):
    id: int

    class Config:
        from_attributes = True

class PropertyDetails(PropertyDetailsInDBBase):
    property: PropertySummary
    utilities: Optional[List[UtilitySummary]] = []

    class Config:
        from_attributes = True