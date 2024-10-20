# app/models/utility.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Utility(Base):
    __tablename__ = 'utilities'

    id = Column(Integer, primary_key=True)
    property_details_id = Column(Integer, ForeignKey('property_details.id'), nullable=False)
    utility_type = Column(String(50), nullable=False)
    company_name = Column(String(100), nullable=False)
    account_number = Column(String(50), nullable=True)
    contact_number = Column(String(20), nullable=True)
    website = Column(String(255), nullable=True)

    # Relationships
    property_details = relationship('PropertyDetails', back_populates='utilities')
