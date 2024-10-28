# app/crud/crud_tenant.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from app.models.tenant import Tenant
from app.models.lease import Lease
from app.models.property import Property
from app.schemas.tenant import TenantCreate, TenantUpdate

class CRUDTenant:
    async def get_tenant(self, db: AsyncSession, tenant_id: int, owner_id: int) -> Optional[Tenant]:
        result = await db.execute(
            select(Tenant)
            .join(Tenant.leases)
            .join(Property)
            .filter(Tenant.id == tenant_id)
            .filter(Property.owner_id == owner_id)
        )
        return result.scalars().first()

    async def get_tenants(self, db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 100) -> List[Tenant]:
        result = await db.execute(
            select(Tenant)
            .join(Tenant.leases)
            .join(Property)
            .filter(Property.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def create_tenant(self, db: AsyncSession, tenant_in: TenantCreate, owner_id: int) -> Tenant:
        db_tenant = Tenant(**tenant_in.dict())
        db.add(db_tenant)
        try:
            await db.commit()
            await db.refresh(db_tenant)
        except IntegrityError as e:
            await db.rollback()
            raise ValueError("An error occurred while creating the tenant: " + str(e))
        return db_tenant

    async def update_tenant(self, db: AsyncSession, db_tenant: Tenant, tenant_in: TenantUpdate) -> Tenant:
        update_data = tenant_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_tenant, key, value)
        try:
            await db.commit()
            await db.refresh(db_tenant)
        except IntegrityError as e:
            await db.rollback()
            raise ValueError("An error occurred while updating the tenant: " + str(e))
        return db_tenant

    async def delete_tenant(self, db: AsyncSession, tenant_id: int, owner_id: int) -> Optional[Tenant]:
        db_tenant = await self.get_tenant(db, tenant_id, owner_id)
        if db_tenant:
            await db.delete(db_tenant)
            try:
                await db.commit()
            except IntegrityError as e:
                await db.rollback()
                raise ValueError("An error occurred while deleting the tenant: " + str(e))
        return db_tenant

# Initialize the CRUD object
crud_tenant = CRUDTenant()
