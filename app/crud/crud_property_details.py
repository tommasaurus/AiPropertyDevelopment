# app/crud/crud_property_details.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import Optional
from app.models.property_details import PropertyDetails
from app.models.property import Property
from app.schemas.property_details import PropertyDetailsCreate, PropertyDetailsUpdate

class CRUDPropertyDetails:
    async def get_property_details(self, db: AsyncSession, property_id: int, owner_id: int) -> Optional[PropertyDetails]:
        result = await db.execute(
            select(PropertyDetails)
            .join(Property)
            .filter(PropertyDetails.property_id == property_id)
            .filter(Property.owner_id == owner_id)
        )
        return result.scalars().first()

    async def create_property_details(self, db: AsyncSession, details_in: PropertyDetailsCreate, owner_id: int) -> PropertyDetails:
        # Verify that the property exists and belongs to the owner
        result = await db.execute(
            select(Property).filter(Property.id == details_in.property_id, Property.owner_id == owner_id)
        )
        property = result.scalars().first()
        if not property:
            raise ValueError("Property not found or you do not have permission to access this property.")

        db_details = PropertyDetails(**details_in.dict())
        db.add(db_details)
        try:
            await db.commit()
            await db.refresh(db_details)
        except IntegrityError as e:
            await db.rollback()
            raise ValueError("An error occurred while creating the property details: " + str(e))
        return db_details

    async def update_property_details(self, db: AsyncSession, db_details: PropertyDetails, details_in: PropertyDetailsUpdate) -> PropertyDetails:
        update_data = details_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_details, key, value)
        try:
            await db.commit()
            await db.refresh(db_details)
        except IntegrityError as e:
            await db.rollback()
            raise ValueError("An error occurred while updating the property details: " + str(e))
        return db_details

# Initialize the CRUD object
crud_property_details = CRUDPropertyDetails()
