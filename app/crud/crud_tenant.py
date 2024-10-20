# app/crud/crud_tenant.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate

def get_tenant(db: Session, tenant_id: int) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.id == tenant_id).first()

def get_tenants(db: Session, skip: int = 0, limit: int = 100) -> List[Tenant]:
    return db.query(Tenant).offset(skip).limit(limit).all()

def create_tenant(db: Session, tenant_in: TenantCreate) -> Tenant:
    db_tenant = Tenant(**tenant_in.dict())
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant

def update_tenant(db: Session, db_tenant: Tenant, tenant_in: TenantUpdate) -> Tenant:
    update_data = tenant_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_tenant, key, value)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant

def delete_tenant(db: Session, tenant_id: int):
    db_tenant = get_tenant(db, tenant_id)
    if db_tenant:
        db.delete(db_tenant)
        db.commit()
    return db_tenant
