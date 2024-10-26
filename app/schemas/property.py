# app/schemas/property.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.user_summary import UserSummary
from app.schemas.lease_summary import LeaseSummary
from app.schemas.expense_summary import ExpenseSummary
from app.schemas.income_summary import IncomeSummary
from app.schemas.invoice_summary import InvoiceSummary
from app.schemas.contract_summary import ContractSummary

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
    purchase_date: Optional[date] = None
    property_type: Optional[str] = None

    class Config:
        orm_mode = True  # Include orm_mode to ensure compatibility with ORM models

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(PropertyBase):  # Inherit from PropertyBase to avoid redundancy
    # All fields will be optional because PropertyBase's fields are already optional
    pass

class PropertyInDBBase(PropertyBase):
    id: int

    class Config:
        orm_mode = True

class Property(PropertyInDBBase):
    owner: UserSummary
    leases: Optional[List[LeaseSummary]] = []
    expenses: Optional[List[ExpenseSummary]] = []
    incomes: Optional[List[IncomeSummary]] = []
    invoices: Optional[List[InvoiceSummary]] = []
    contracts: Optional[List[ContractSummary]] = []    

    class Config:
        orm_mode = True
