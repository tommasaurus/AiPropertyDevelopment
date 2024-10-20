# app/models/invoice.py

from sqlalchemy import Column, Integer, Float, Date, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Invoice(Base):
    __tablename__ = 'invoices'

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    vendor_id = Column(Integer, ForeignKey('vendors.id'), nullable=False)
    invoice_number = Column(String(50), nullable=True)
    amount = Column(Float, nullable=False)
    invoice_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=True)
    status = Column(String(20), default='Unpaid')
    description = Column(Text, nullable=True)
    document_url = Column(String(255), nullable=True)

    # Relationships
    property = relationship('Property', back_populates='invoices')
    vendor = relationship('Vendor', back_populates='invoices')
    documents = relationship('Document', back_populates='invoice')
