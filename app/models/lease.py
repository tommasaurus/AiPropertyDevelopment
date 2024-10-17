from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class LeaseAgreement(Base):
    __tablename__ = "lease_agreements"

    id = Column(Integer, primary_key=True, index=True)
    tenant_name = Column(String, nullable=False)
    lease_start = Column(Date)
    lease_end = Column(Date)
    rent_amount = Column(Float)
    lease_terms = Column(String)
    document_url = Column(String)
    
    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="lease_agreements")
