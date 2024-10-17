# app/models/contractor_vendor.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class ContractorVendor(Base):
    __tablename__ = "contractors_vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_info = Column(String)
    service_type = Column(String)  # e.g., Electrical, Plumbing
    contract_details = Column(String)
    performance_metrics = Column(String)  # e.g., Ratings, Reviews

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="contractors_vendors")
