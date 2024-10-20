# app/models/contract.py

from sqlalchemy import Column, Integer, String, Date, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Contract(Base):
    __tablename__ = 'contracts'

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    vendor_id = Column(Integer, ForeignKey('vendors.id'), nullable=False)
    contract_type = Column(String(50), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    terms = Column(Text, nullable=True)
    document_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    property = relationship('Property', back_populates='contracts')
    vendor = relationship('Vendor', back_populates='contracts')
    documents = relationship('Document', back_populates='contract')
