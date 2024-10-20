# app/schemas/__init__.py

from .user import User, UserCreate, UserUpdate
from .property import Property, PropertyCreate, PropertyUpdate
from .property_details import PropertyDetails, PropertyDetailsCreate, PropertyDetailsUpdate
from .utility import Utility, UtilityCreate, UtilityUpdate
from .tenant import Tenant, TenantCreate, TenantUpdate
from .lease import Lease, LeaseCreate, LeaseUpdate
from .payment import Payment, PaymentCreate, PaymentUpdate
from .expense import Expense, ExpenseCreate, ExpenseUpdate
from .income import Income, IncomeCreate, IncomeUpdate
from .invoice import Invoice, InvoiceCreate, InvoiceUpdate
from .vendor import Vendor, VendorCreate, VendorUpdate
from .contract import Contract, ContractCreate, ContractUpdate
from .document import Document, DocumentCreate, DocumentUpdate
from .token import Token

__all__ = [
    "User",
    "UserCreate",
    "UserUpdate",
    "Property",
    "PropertyCreate",
    "PropertyUpdate",
    "PropertyDetails",
    "PropertyDetailsCreate",
    "PropertyDetailsUpdate",
    "Utility",
    "UtilityCreate",
    "UtilityUpdate",
    "Tenant",
    "TenantCreate",
    "TenantUpdate",
    "Lease",
    "LeaseCreate",
    "LeaseUpdate",
    "Payment",
    "PaymentCreate",
    "PaymentUpdate",
    "Expense",
    "ExpenseCreate",
    "ExpenseUpdate",
    "Income",
    "IncomeCreate",
    "IncomeUpdate",
    "Invoice",
    "InvoiceCreate",
    "InvoiceUpdate",
    "Vendor",
    "VendorCreate",
    "VendorUpdate",
    "Contract",
    "ContractCreate",
    "ContractUpdate",
    "Document",
    "DocumentCreate",
    "DocumentUpdate",
    "Token"    
]
