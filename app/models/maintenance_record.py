# app/models/maintenance_record.py

from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float
from sqlalchemy.orm import relationship
from ..database import Base

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"

    id = Column(Integer, primary_key=True, index=True)
    maintenance_type = Column(String, nullable=False)  # e.g., Routine, Repair
    description = Column(String)
    date_performed = Column(Date)
    cost = Column(Float)
    contractor_vendor_id = Column(Integer, ForeignKey("contractors_vendors.id"))
    document_url = Column(String)

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="maintenance_records")
    contractor_vendor = relationship("ContractorVendor")
