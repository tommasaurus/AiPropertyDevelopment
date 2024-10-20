# app/api/endpoints/vendor.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=schemas.Vendor)
async def create_vendor(
    vendor_in: schemas.VendorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.crud_vendor.create_vendor(db=db, vendor_in=vendor_in)

@router.get("/", response_model=List[schemas.Vendor])
async def read_vendors(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vendors = await crud.crud_vendor.get_vendors(db=db, skip=skip, limit=limit)
    return vendors

@router.get("/{vendor_id}", response_model=schemas.Vendor)
async def read_vendor(
    vendor_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vendor = await crud.crud_vendor.get_vendor(db=db, vendor_id=vendor_id)
    if vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.put("/{vendor_id}", response_model=schemas.Vendor)
async def update_vendor(
    vendor_id: int,
    vendor_in: schemas.VendorUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vendor = await crud.crud_vendor.get_vendor(db=db, vendor_id=vendor_id)
    if vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return await crud.crud_vendor.update_vendor(db=db, vendor=vendor, vendor_in=vendor_in)

@router.delete("/{vendor_id}", response_model=schemas.Vendor)
async def delete_vendor(
    vendor_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vendor = await crud.crud_vendor.delete_vendor(db=db, vendor_id=vendor_id)
    if vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor
