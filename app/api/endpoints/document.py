# # app/api/endpoints/document.py

# from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, BackgroundTasks
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List
# from app import schemas, crud
# from app.db.database import get_db
# from app.core.security import get_current_user
# from app.models.user import User
# import os
# from uuid import uuid4
# from app.utils.file_utils import save_upload_file, allowed_file
# from app.services.document_processor import process_document
# import logging

# router = APIRouter()

# # Directory to save uploaded files
# UPLOAD_DIRECTORY = "uploads/documents/"

# # Ensure the upload directory exists
# os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# logger = logging.getLogger(__name__)
# logging.basicConfig(level=logging.INFO)

# async def process_uploaded_document(
#     file_path: str, document_type: str, document_id: int, db: AsyncSession
# ):
#     """
#     Background task to process the uploaded document.

#     Args:
#         file_path (str): The path to the uploaded file.
#         document_type (str): The type of the document.
#         document_id (int): The ID of the document in the database.
#         db (AsyncSession): The database session.
#     """
#     try:
#         extracted_data = process_document(file_path, document_type)
#         logger.info(f"Extracted data: {extracted_data}")

#         # Depending on the document type, create related entries
#         if document_type.lower() == "invoice":
#             from app.crud.crud_invoice import crud_invoice
#             from app.schemas.invoice import InvoiceCreate

#             invoice_in = InvoiceCreate(**extracted_data)
#             await crud_invoice.create_invoice(db, invoice_in, document_id)

#         elif document_type.lower() == "lease":
#             from app.crud.crud_lease import crud_lease
#             from app.schemas.lease import LeaseCreate

#             lease_in = LeaseCreate(**extracted_data)
#             await crud_lease.create_lease(db, lease_in, document_id)

#         elif document_type.lower() == "receipt":
#             from app.crud.crud_receipt import crud_receipt
#             from app.schemas.receipt import ReceiptCreate

#             receipt_in = ReceiptCreate(**extracted_data)
#             await crud_receipt.create_receipt(db, receipt_in, document_id)

#         else:
#             logger.warning(f"Unknown document type: {document_type}. Skipping related data creation.")

#         # Optionally, update the document's status or add metadata
#         # e.g., await crud_document.update_document_status(db, document_id, status="processed")

#     except Exception as e:
#         logger.error(f"Error processing document {document_id}: {str(e)}")
#         # Optionally, update the document's status to 'failed'
#         # e.g., await crud_document.update_document_status(db, document_id, status="failed")

# @router.post("/", response_model=schemas.Document, status_code=status.HTTP_201_CREATED)
# async def create_document(
#     background_tasks: BackgroundTasks,
#     document_in: schemas.DocumentCreate = Depends(),
#     file: UploadFile = File(...),
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Uploads a document and initiates processing.

#     Args:
#         background_tasks (BackgroundTasks): FastAPI background tasks.
#         document_in (DocumentCreate): Document metadata.
#         file (UploadFile): The uploaded file.
#         db (AsyncSession): The database session.
#         current_user (User): The authenticated user.

#     Returns:
#         Document: The created document entry.
#     """
#     if not allowed_file(file.filename):
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Unsupported file type. Allowed types: png, jpg, jpeg, pdf."
#         )

#     # Save the uploaded file
#     file_path = save_upload_file(file, destination=f"{UPLOAD_DIRECTORY}{current_user.id}/")

#     # Create the document entry in the database
#     document_data = schemas.DocumentCreate(
#         filename=file.filename,
#         file_url=file_path,
#         document_type=document_in.document_type
#     )
#     document = await crud.crud_document.create_document(db, document_in=document_data, user_id=current_user.id)

#     # Initiate background processing
#     background_tasks.add_task(
#         process_uploaded_document,
#         file_path=file_path,
#         document_type=document.document_type,
#         document_id=document.id,
#         db=db
#     )

#     return document

# @router.get("/", response_model=List[schemas.Document])
# async def read_documents(
#     skip: int = 0,
#     limit: int = 100,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Retrieves a list of documents uploaded by the user.

#     Args:
#         skip (int): Number of records to skip.
#         limit (int): Maximum number of records to return.
#         db (AsyncSession): The database session.
#         current_user (User): The authenticated user.

#     Returns:
#         List[Document]: A list of documents.
#     """
#     documents = await crud.crud_document.get_documents(db=db, skip=skip, limit=limit, user_id=current_user.id)
#     return documents

# @router.get("/{document_id}", response_model=schemas.Document)
# async def read_document(
#     document_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Retrieves a specific document by ID.

#     Args:
#         document_id (int): The ID of the document.
#         db (AsyncSession): The database session.
#         current_user (User): The authenticated user.

#     Returns:
#         Document: The requested document.
#     """
#     document = await crud.crud_document.get_document(db=db, document_id=document_id, user_id=current_user.id)
#     if document is None:
#         raise HTTPException(status_code=404, detail="Document not found")
#     return document

# @router.put("/{document_id}", response_model=schemas.Document)
# async def update_document(
#     document_id: int,
#     document_in: schemas.DocumentCreate,
#     file: UploadFile = File(None),
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Updates an existing document.

#     Args:
#         document_id (int): The ID of the document to update.
#         document_in (DocumentCreate): The updated document data.
#         file (UploadFile, optional): A new file to replace the existing one.
#         db (AsyncSession): The database session.
#         current_user (User): The authenticated user.

#     Returns:
#         Document: The updated document.
#     """
#     document = await crud.crud_document.get_document(db=db, document_id=document_id, user_id=current_user.id)
#     if document is None:
#         raise HTTPException(status_code=404, detail="Document not found")

#     if file:
#         if not allowed_file(file.filename):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Unsupported file type. Allowed types: png, jpg, jpeg, pdf."
#             )
#         # Save the new file and update the file URL
#         new_file_path = save_upload_file(file, destination=f"{UPLOAD_DIRECTORY}{current_user.id}/")
#         # Optionally, delete the old file
#         if os.path.exists(document.file_url):
#             os.remove(document.file_url)
#         document_in.file_url = new_file_path
#         document_in.filename = file.filename

#     updated_document = await crud.crud_document.update_document(db=db, document=document, document_in=document_in)
#     return updated_document

# @router.delete("/{document_id}", response_model=schemas.Document)
# async def delete_document(
#     document_id: int,
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Deletes a document.

#     Args:
#         document_id (int): The ID of the document to delete.
#         db (AsyncSession): The database session.
#         current_user (User): The authenticated user.

#     Returns:
#         Document: The deleted document.
#     """
#     document = await crud.crud_document.delete_document(db=db, document_id=document_id, user_id=current_user.id)
#     if document is None:
#         raise HTTPException(status_code=404, detail="Document not found")
    
#     # Delete the file from the filesystem
#     if os.path.exists(document.file_url):
#         os.remove(document.file_url)
    
#     return document