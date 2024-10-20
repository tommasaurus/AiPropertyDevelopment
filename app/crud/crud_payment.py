# app/crud/crud_payment.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentUpdate

def get_payment(db: Session, payment_id: int) -> Optional[Payment]:
    return db.query(Payment).filter(Payment.id == payment_id).first()

def get_payments(db: Session, skip: int = 0, limit: int = 100) -> List[Payment]:
    return db.query(Payment).offset(skip).limit(limit).all()

def create_payment(db: Session, payment_in: PaymentCreate) -> Payment:
    db_payment = Payment(**payment_in.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def update_payment(db: Session, db_payment: Payment, payment_in: PaymentUpdate) -> Payment:
    update_data = payment_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_payment, key, value)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def delete_payment(db: Session, payment_id: int):
    db_payment = get_payment(db, payment_id)
    if db_payment:
        db.delete(db_payment)
        db.commit()
    return db_payment
