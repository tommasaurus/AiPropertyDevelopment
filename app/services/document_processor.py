# app/services/document_processor.py

import openai
from app.core.config import settings
from typing import Dict, Any
import pytesseract
from PIL import Image
import pdfplumber
import re
import json
import logging

# Initialize OpenAI API key
openai.api_key = settings.OPENAI_API_KEY

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def extract_text_from_file(file_path: str) -> str:
    """
    Extracts text from an image or PDF file using OCR.

    Args:
        file_path (str): The path to the file.

    Returns:
        str: The extracted text.
    """
    file_extension = os.path.splitext(file_path)[1].lower()
    text = ""

    try:
        if file_extension in {".png", ".jpg", ".jpeg"}:
            logger.info(f"Extracting text from image: {file_path}")
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
        elif file_extension == ".pdf":
            logger.info(f"Extracting text from PDF: {file_path}")
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
        else:
            logger.warning(f"Unsupported file type: {file_extension}")
    except Exception as e:
        logger.error(f"Error during text extraction: {str(e)}")
        raise

    return text

def process_document(file_path: str, document_type: str) -> Dict[str, Any]:
    """
    Processes the document using OpenAI API to extract relevant data.

    Args:
        file_path (str): The path to the file.
        document_type (str): The type of the document (invoice, lease, receipt).

    Returns:
        Dict[str, Any]: The extracted data mapped to database schema fields.
    """
    text_content = extract_text_from_file(file_path)
    if not text_content.strip():
        logger.error("No text extracted from the document.")
        raise ValueError("No text extracted from the document.")

    prompt = generate_prompt(document_type, text_content)

    try:
        logger.info("Sending request to OpenAI API.")
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=500,
            temperature=0.2,
            n=1,
            stop=None,
        )
        logger.info("Received response from OpenAI API.")
        extracted_data = parse_openai_response(response.choices[0].text)
        return extracted_data
    except Exception as e:
        logger.error(f"Error during OpenAI processing: {str(e)}")
        raise

def generate_prompt(document_type: str, text_content: str) -> str:
    """
    Generates a prompt for OpenAI based on the document type.

    Args:
        document_type (str): The type of the document.
        text_content (str): The extracted text from the document.

    Returns:
        str: The prompt for OpenAI API.
    """
    prompts = {
        "invoice": (
            "Extract the following information from the invoice and provide the output in JSON format:\n"
            "- Invoice Number\n"
            "- Vendor Name\n"
            "- Amount\n"
            "- Invoice Date\n"
        ),
        "lease": (
            "Extract the following information from the lease agreement and provide the output in JSON format:\n"
            "- Tenant Name\n"
            "- Start Date\n"
            "- End Date\n"
            "- Monthly Rent\n"
        ),
        "receipt": (
            "Extract the following information from the receipt and provide the output in JSON format:\n"
            "- Merchant Name\n"
            "- Amount\n"
            "- Receipt Date\n"
        ),
    }

    base_prompt = prompts.get(document_type.lower())
    if not base_prompt:
        logger.warning(f"Unknown document type: {document_type}. Using generic extraction.")
        base_prompt = (
            "Extract key information from the following text and provide the output in JSON format.\n"
        )

    full_prompt = base_prompt + "\n" + text_content
    return full_prompt

def parse_openai_response(response_text: str) -> Dict[str, Any]:
    """
    Parses the OpenAI API response text into a structured dictionary.

    Args:
        response_text (str): The raw response text from OpenAI.

    Returns:
        Dict[str, Any]: The structured data.
    """
    try:
        # Attempt to extract JSON from the response
        json_str = re.search(r'\{.*\}', response_text, re.DOTALL).group()
        extracted_data = json.loads(json_str)
        logger.info("Successfully parsed OpenAI response.")
        return extracted_data
    except Exception as e:
        logger.error(f"Failed to parse OpenAI response: {str(e)}")
        raise ValueError("Failed to parse OpenAI response as JSON.")
