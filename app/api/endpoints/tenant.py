# app/api/endpoints/tenant.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import schemas, crud
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=schemas.Tenant)
async def create_tenant(
    tenant_in: schemas.TenantCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.crud_tenant.create_tenant(db=db, tenant_in=tenant_in)

@router.get("/", response_model=List[schemas.Tenant])
async def read_tenants(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tenants = await crud.crud_tenant.get_tenants(db=db, skip=skip, limit=limit)
    return tenants

@router.get("/{tenant_id}", response_model=schemas.Tenant)
async def read_tenant(
    tenant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tenant = await crud.crud_tenant.get_tenant(db=db, tenant_id=tenant_id)
    if tenant is None:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@router.put("/{tenant_id}", response_model=schemas.Tenant)
async def update_tenant(
    tenant_id: int,
    tenant_in: schemas.TenantUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tenant = await crud.crud_tenant.get_tenant(db=db, tenant_id=tenant_id)
    if tenant is None:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return await crud.crud_tenant.update_tenant(db=db, tenant=tenant, tenant_in=tenant_in)

@router.delete("/{tenant_id}", response_model=schemas.Tenant)
async def delete_tenant(
    tenant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tenant = await crud.crud_tenant.delete_tenant(db=db, tenant_id=tenant_id)
    if tenant is None:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant
