# app/schemas/utility.py

from pydantic import BaseModel
from typing import Optional
from app.schemas.property_details_summary import PropertyDetailsSummary

class UtilityBase(BaseModel):
    property_details_id: int
    utility_type: str
    company_name: str
    account_number: Optional[str] = None
    contact_number: Optional[str] = None
    website: Optional[str] = None

class UtilityCreate(UtilityBase):
    pass

class UtilityUpdate(BaseModel):
    utility_type: Optional[str] = None
    company_name: Optional[str] = None
    account_number: Optional[str] = None
    contact_number: Optional[str] = None
    website: Optional[str] = None

class UtilityInDBBase(UtilityBase):
    id: int

    class Config:
        orm_mode = True

class Utility(UtilityInDBBase):
    property_details: PropertyDetailsSummary

    class Config:
        orm_mode = True
