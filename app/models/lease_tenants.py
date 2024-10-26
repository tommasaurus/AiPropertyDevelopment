# app/models/lease_tenants.py

from sqlalchemy import Table, Column, Integer, ForeignKey
from app.db.database import Base

lease_tenants = Table(
    'lease_tenants',
    Base.metadata,
    Column('lease_id', Integer, ForeignKey('leases.id'), primary_key=True),
    Column('tenant_id', Integer, ForeignKey('tenants.id'), primary_key=True)
)
