# app/utils/file_utils.py

import os
from fastapi import UploadFile, HTTPException
import shutil
from uuid import uuid4
from typing import Tuple

UPLOAD_DIR = "uploads/documents/"

def save_upload_file(
    upload_file: UploadFile, destination: str = UPLOAD_DIR
) -> str:
    """
    Saves an uploaded file to the specified destination with a unique filename.

    Args:
        upload_file (UploadFile): The uploaded file from FastAPI.
        destination (str): The destination directory.

    Returns:
        str: The path to the saved file.
    """
    if not os.path.exists(destination):
        os.makedirs(destination, exist_ok=True)

    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid4().hex}{file_extension}"
    file_path = os.path.join(destination, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to save file: {str(e)}"
        )
    finally:
        upload_file.file.close()

    return file_path

def allowed_file(filename: str) -> bool:
    """
    Checks if the uploaded file has an allowed extension.

    Args:
        filename (str): The name of the uploaded file.

    Returns:
        bool: True if allowed, False otherwise.
    """
    allowed_extensions = {".png", ".jpg", ".jpeg", ".pdf"}
    file_extension = os.path.splitext(filename)[1].lower()
    return file_extension in allowed_extensions
