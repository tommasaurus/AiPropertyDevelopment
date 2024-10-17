# app/models/communication.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database import Base

class Communication(Base):
    __tablename__ = "communications"

    id = Column(Integer, primary_key=True, index=True)
    communication_type = Column(String, nullable=False)  # e.g., Internal, External
    subject = Column(String)
    content = Column(String)
    date = Column(DateTime)
    related_party = Column(String)  # e.g., Tenant Name, Vendor Name
    document_url = Column(String)

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="communications")
