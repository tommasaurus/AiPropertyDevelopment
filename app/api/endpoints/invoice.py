# app/api/endpoints/invoice.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=schemas.Invoice)
async def create_invoice(
    invoice_in: schemas.InvoiceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.crud_invoice.create_invoice(db=db, invoice_in=invoice_in)

@router.get("/", response_model=List[schemas.Invoice])
async def read_invoices(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoices = await crud.crud_invoice.get_invoices(db=db, skip=skip, limit=limit)
    return invoices

@router.get("/{invoice_id}", response_model=schemas.Invoice)
async def read_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = await crud.crud_invoice.get_invoice(db=db, invoice_id=invoice_id)
    if invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.put("/{invoice_id}", response_model=schemas.Invoice)
async def update_invoice(
    invoice_id: int,
    invoice_in: schemas.InvoiceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = await crud.crud_invoice.get_invoice(db=db, invoice_id=invoice_id)
    if invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return await crud.crud_invoice.update_invoice(db=db, invoice=invoice, invoice_in=invoice_in)

@router.delete("/{invoice_id}", response_model=schemas.Invoice)
async def delete_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = await crud.crud_invoice.delete_invoice(db=db, invoice_id=invoice_id)
    if invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice
