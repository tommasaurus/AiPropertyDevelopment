# app/models/utility_service.py

from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..database import Base

class UtilityService(Base):
    __tablename__ = "utility_services"

    id = Column(Integer, primary_key=True, index=True)
    utility_type = Column(String, nullable=False)  # e.g., Electricity, Water
    provider_name = Column(String)
    account_number = Column(String, unique=True)
    contact_info = Column(String)
    service_agreement = Column(String)
    billing_information = Column(String)
    usage_data = Column(Float)  # e.g., monthly consumption
    cost_tracking = Column(Float)  # e.g., monthly cost

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="utilities_services")
