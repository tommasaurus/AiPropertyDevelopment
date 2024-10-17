from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, unique=True, index=True, nullable=False)
    parcel_number = Column(String, unique=True, nullable=False)
    property_type = Column(String)
    zoning_info = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    lot_size = Column(String)
    building_footprint = Column(String)
    owner_name = Column(String)
    owner_contact = Column(String)
    
    # Relationships
    financial_info = relationship("FinancialInfo", back_populates="property", uselist=False)
    lease_agreements = relationship("LeaseAgreement", back_populates="property")
    # Add relationships for other categories similarly
