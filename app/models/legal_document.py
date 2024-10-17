# app/models/legal_document.py

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from ..database import Base

class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(Integer, primary_key=True, index=True)
    document_type = Column(String, nullable=False)  # e.g., Deed, Title Insurance
    description = Column(String)
    document_url = Column(String)
    date_issued = Column(Date)

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="legal_documents")
