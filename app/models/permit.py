# app/models/permit.py

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from ..database import Base

class Permit(Base):
    __tablename__ = "permits"

    id = Column(Integer, primary_key=True, index=True)
    permit_type = Column(String, nullable=False)  # e.g., Building, Electrical
    description = Column(String)
    permit_number = Column(String, unique=True)
    issue_date = Column(Date)
    expiration_date = Column(Date)
    document_url = Column(String)

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="permits")
