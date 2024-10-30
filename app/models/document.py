# app/models/document.py

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True, autoincrement=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=True)    
    lease_id = Column(Integer, ForeignKey('leases.id'), nullable=True)
    expense_id = Column(Integer, ForeignKey('expenses.id'), nullable=True)
    invoice_id = Column(Integer, ForeignKey('invoices.id'), unique=True, nullable=True)
    contract_id = Column(Integer, ForeignKey('contracts.id'), nullable=True)
    document_type = Column(String(50), nullable=False)    
    upload_date = Column(DateTime, default=datetime.utcnow)
    description = Column(Text, nullable=True)

    # Relationships
    property = relationship('Property', back_populates='documents')    
    lease = relationship('Lease', uselist=False, back_populates='document')
    expense = relationship('Expense', back_populates='documents')
    invoice = relationship('Invoice', back_populates='document')
    contract = relationship('Contract', back_populates='documents')
