# app/crud/crud_invoice.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate

def get_invoice(db: Session, invoice_id: int) -> Optional[Invoice]:
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

def get_invoices(db: Session, skip: int = 0, limit: int = 100) -> List[Invoice]:
    return db.query(Invoice).offset(skip).limit(limit).all()

def create_invoice(db: Session, invoice_in: InvoiceCreate) -> Invoice:
    db_invoice = Invoice(**invoice_in.dict())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def update_invoice(db: Session, db_invoice: Invoice, invoice_in: InvoiceUpdate) -> Invoice:
    update_data = invoice_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_invoice, key, value)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def delete_invoice(db: Session, invoice_id: int):
    db_invoice = get_invoice(db, invoice_id)
    if db_invoice:
        db.delete(db_invoice)
        db.commit()
    return db_invoice
