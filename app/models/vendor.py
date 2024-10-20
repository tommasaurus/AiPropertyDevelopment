# app/models/vendor.py

from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Vendor(Base):
    __tablename__ = 'vendors'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    contact_person = Column(String(100), nullable=True)
    phone_number = Column(String(20), nullable=True)
    email = Column(String(120), nullable=True)
    address = Column(String(255), nullable=True)
    services_provided = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)

    # Relationships
    expenses = relationship('Expense', back_populates='vendor')
    invoices = relationship('Invoice', back_populates='vendor')
    contracts = relationship('Contract', back_populates='vendor')
