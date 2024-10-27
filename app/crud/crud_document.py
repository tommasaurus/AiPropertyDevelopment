# app/crud/crud_document.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate

class CRUDDocument:
    async def get_document(self, db: AsyncSession, document_id: int) -> Optional[Document]:
        result = await db.execute(select(Document).filter(Document.id == document_id))
        return result.scalars().first()

    async def get_documents(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Document]:
        result = await db.execute(select(Document).offset(skip).limit(limit))
        return result.scalars().all()

    async def create_document(self, db: AsyncSession, document_in: DocumentCreate) -> Document:
        db_document = Document(**document_in.dict())
        db.add(db_document)
        await db.commit()
        await db.refresh(db_document)
        return db_document

    async def update_document(self, db: AsyncSession, db_document: Document, document_in: DocumentUpdate) -> Document:
        update_data = document_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_document, key, value)
        await db.commit()
        await db.refresh(db_document)
        return db_document

    async def delete_document(self, db: AsyncSession, document_id: int):
        db_document = await self.get_document(db, document_id)
        if db_document:
            await db.delete(db_document)
            await db.commit()
        return db_document

# Initialize the CRUD object
crud_document = CRUDDocument()
