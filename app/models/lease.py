# app/models/lease.py

from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Lease(Base):
    __tablename__ = 'leases'

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    tenant_id = Column(Integer, ForeignKey('tenants.id'), nullable=False)
    lease_type = Column(String(50), nullable=False)
    rent_amount = Column(Float, nullable=False)
    security_deposit = Column(Float, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    lease_terms = Column(Text, nullable=True)
    payment_frequency = Column(String(20), default='Monthly')
    is_active = Column(Boolean, default=True)

    # Relationships
    property = relationship('Property', back_populates='leases')
    tenant = relationship('Tenant', back_populates='leases')
    payments = relationship('Payment', back_populates='lease')
    documents = relationship('Document', back_populates='lease')
