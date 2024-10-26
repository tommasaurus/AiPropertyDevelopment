# app/models/lease.py

from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.database import Base
from app.models.lease_tenants import lease_tenants 

class Lease(Base):
    __tablename__ = 'leases'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Auto-incrementing primary key
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    
    # Main fields
    lease_type = Column(String(50), nullable=False)
    rent_amount_total = Column(Float, nullable=True)
    rent_amount_monthly = Column(Float, nullable=True)
    security_deposit_amount = Column(String(50), nullable=True)
    security_deposit_held_by = Column(String(100), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    payment_frequency = Column(String(20), default='Monthly')
    tenant_info = Column(JSONB, nullable=True)
    special_lease_terms = Column(JSONB, nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    property = relationship('Property', back_populates='leases')
    tenants = relationship('Tenant', secondary=lease_tenants, back_populates='leases')  # Use direct reference
    payments = relationship('Payment', back_populates='lease')
    documents = relationship('Document', back_populates='lease')
