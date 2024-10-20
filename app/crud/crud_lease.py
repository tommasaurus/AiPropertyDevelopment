# app/crud/crud_lease.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.lease import Lease
from app.schemas.lease import LeaseCreate, LeaseUpdate

def get_lease(db: Session, lease_id: int) -> Optional[Lease]:
    return db.query(Lease).filter(Lease.id == lease_id).first()

def get_leases(db: Session, skip: int = 0, limit: int = 100) -> List[Lease]:
    return db.query(Lease).offset(skip).limit(limit).all()

def create_lease(db: Session, lease_in: LeaseCreate) -> Lease:
    db_lease = Lease(**lease_in.dict())
    db.add(db_lease)
    db.commit()
    db.refresh(db_lease)
    return db_lease

def update_lease(db: Session, db_lease: Lease, lease_in: LeaseUpdate) -> Lease:
    update_data = lease_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_lease, key, value)
    db.commit()
    db.refresh(db_lease)
    return db_lease

def delete_lease(db: Session, lease_id: int):
    db_lease = get_lease(db, lease_id)
    if db_lease:
        db.delete(db_lease)
        db.commit()
    return db_lease
