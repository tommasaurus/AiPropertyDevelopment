# app/models/tenant.py

from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.lease_tenants import lease_tenants  

class Tenant(Base):
    __tablename__ = 'tenants'

    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(120), nullable=True)
    phone_number = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)

    # Relationships
    leases = relationship('Lease', secondary=lease_tenants, back_populates='tenants')  
    documents = relationship('Document', back_populates='tenant')
