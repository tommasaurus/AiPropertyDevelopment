# app/crud/crud_document.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from app.models.document import Document
from app.models.property import Property
from app.schemas.document import DocumentCreate, DocumentUpdate

class CRUDDocument:
    async def get_document(self, db: AsyncSession, document_id: int, owner_id: int) -> Optional[Document]:
        result = await db.execute(
            select(Document)
            .join(Property)
            .filter(Document.id == document_id)
            .filter(Property.owner_id == owner_id)
        )
        return result.scalars().first()

    async def get_documents(self, db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 100) -> List[Document]:
        result = await db.execute(
            select(Document)
            .join(Property)
            .filter(Property.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def create_document(self, db: AsyncSession, document_in: DocumentCreate, owner_id: int) -> Document:
        # Verify that the property exists and belongs to the owner (if property_id is provided)
        if document_in.property_id:
            result = await db.execute(
                select(Property).filter(Property.id == document_in.property_id, Property.owner_id == owner_id)
            )
            property = result.scalars().first()
            if not property:
                raise ValueError("Property not found or you do not have permission to access this property.")

        db_document = Document(**document_in.dict())
        db.add(db_document)
        try:
            await db.commit()
            await db.refresh(db_document)
        except IntegrityError as e:
            await db.rollback()
            raise ValueError("An error occurred while creating the document: " + str(e))
        return db_document

    async def update_document(self, db: AsyncSession, db_document: Document, document_in: DocumentUpdate) -> Document:
        update_data = document_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_document, key, value)
        try:
            await db.commit()
            await db.refresh(db_document)
        except IntegrityError as e:
            await db.rollback()
            raise ValueError("An error occurred while updating the document: " + str(e))
        return db_document

    async def delete_document(self, db: AsyncSession, document_id: int, owner_id: int) -> Optional[Document]:
        db_document = await self.get_document(db, document_id, owner_id)
        if db_document:
            await db.delete(db_document)
            try:
                await db.commit()
            except IntegrityError as e:
                await db.rollback()
                raise ValueError("An error occurred while deleting the document: " + str(e))
        return db_document

# Initialize the CRUD object
crud_document = CRUDDocument()
