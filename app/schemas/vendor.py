# app/schemas/vendor.py

from pydantic import BaseModel
from typing import Optional

class VendorBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    services_provided: Optional[str] = None
    notes: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    services_provided: Optional[str] = None
    notes: Optional[str] = None

class VendorInDBBase(VendorBase):
    id: int

    class Config:
        orm_mode = True

class Vendor(VendorInDBBase):
    pass
