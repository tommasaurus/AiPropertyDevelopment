# app/models/property_details.py

from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class PropertyDetails(Base):
    __tablename__ = 'property_details'

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    year_built = Column(Integer, nullable=True)
    square_footage = Column(Float, nullable=True)
    lot_size = Column(Float, nullable=True)
    zoning = Column(String(50), nullable=True)
    tax_assessed_value = Column(Float, nullable=True)
    insurance_policy_number = Column(String(100), nullable=True)

    # HOA Information
    hoa_name = Column(String(100), nullable=True)
    hoa_contact = Column(String(100), nullable=True)
    hoa_phone = Column(String(20), nullable=True)
    hoa_email = Column(String(100), nullable=True)
    hoa_website = Column(String(255), nullable=True)

    # Relationships
    property = relationship('Property', back_populates='details')
    utilities = relationship('Utility', back_populates='property_details')
