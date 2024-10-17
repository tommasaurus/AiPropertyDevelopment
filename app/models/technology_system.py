# app/models/technology_system.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class TechnologySystem(Base):
    __tablename__ = "technology_systems"

    id = Column(Integer, primary_key=True, index=True)
    system_type = Column(String, nullable=False)  # e.g., HVAC Automation, Security System
    description = Column(String)
    vendor = Column(String)
    installation_date = Column(String)
    document_url = Column(String)
    cybersecurity_measures = Column(String)  # e.g., Firewalls, Encryption
    data_backup = Column(String)  # e.g., Backup Protocols

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="technology")
