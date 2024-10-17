# app/models/insurance_info.py

from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from ..database import Base

class InsuranceInfo(Base):
    __tablename__ = "insurance_infos"

    id = Column(Integer, primary_key=True, index=True)
    insurance_provider = Column(String, nullable=False)
    policy_number = Column(String, unique=True)
    coverage_type = Column(String)  # e.g., Property, Liability
    coverage_limits = Column(Float)
    deductible = Column(Float)
    premium = Column(Float)
    policy_start_date = Column(Date)
    policy_end_date = Column(Date)
    document_url = Column(String)

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="insurance_info")
