# app/crud/crud_vendor.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.vendor import Vendor
from app.schemas.vendor import VendorCreate, VendorUpdate

def get_vendor(db: Session, vendor_id: int) -> Optional[Vendor]:
    return db.query(Vendor).filter(Vendor.id == vendor_id).first()

def get_vendors(db: Session, skip: int = 0, limit: int = 100) -> List[Vendor]:
    return db.query(Vendor).offset(skip).limit(limit).all()

def create_vendor(db: Session, vendor_in: VendorCreate) -> Vendor:
    db_vendor = Vendor(**vendor_in.dict())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def update_vendor(db: Session, db_vendor: Vendor, vendor_in: VendorUpdate) -> Vendor:
    update_data = vendor_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_vendor, key, value)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def delete_vendor(db: Session, vendor_id: int):
    db_vendor = get_vendor(db, vendor_id)
    if db_vendor:
        db.delete(db_vendor)
        db.commit()
    return db_vendor
