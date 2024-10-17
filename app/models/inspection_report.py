# app/models/inspection_report.py

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from ..database import Base

class InspectionReport(Base):
    __tablename__ = "inspection_reports"

    id = Column(Integer, primary_key=True, index=True)
    inspection_type = Column(String, nullable=False)  # e.g., Building, Safety
    inspector_name = Column(String)
    inspection_date = Column(Date)
    findings = Column(String)
    report_url = Column(String)

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="inspection_reports")
