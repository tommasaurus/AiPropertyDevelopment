# app/api/endpoints/lease.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=schemas.Lease)
async def create_lease(
    lease_in: schemas.LeaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.crud_lease.create_lease(db=db, lease_in=lease_in)

@router.get("/", response_model=List[schemas.Lease])
async def read_leases(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leases = await crud.crud_lease.get_leases(db=db, skip=skip, limit=limit)
    return leases

@router.get("/{lease_id}", response_model=schemas.Lease)
async def read_lease(
    lease_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lease = await crud.crud_lease.get_lease(db=db, lease_id=lease_id)
    if lease is None:
        raise HTTPException(status_code=404, detail="Lease not found")
    return lease

@router.put("/{lease_id}", response_model=schemas.Lease)
async def update_lease(
    lease_id: int,
    lease_in: schemas.LeaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lease = await crud.crud_lease.get_lease(db=db, lease_id=lease_id)
    if lease is None:
        raise HTTPException(status_code=404, detail="Lease not found")
    return await crud.crud_lease.update_lease(db=db, lease=lease, lease_in=lease_in)

@router.delete("/{lease_id}", response_model=schemas.Lease)
async def delete_lease(
    lease_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lease = await crud.crud_lease.delete_lease(db=db, lease_id=lease_id)
    if lease is None:
        raise HTTPException(status_code=404, detail="Lease not found")
    return lease
