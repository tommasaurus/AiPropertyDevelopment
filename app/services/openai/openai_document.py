# app/services/openai/openai_document.py

import logging
import json
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessage

# Import your settings or configuration module
from app.core.config import settings

# Initialize logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class OpenAIService:
    def __init__(self):
        # Initialize the OpenAI client
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def extract_information(self, text: str, document_type: str) -> dict:
        """
        Uses OpenAI's API to extract relevant information from the text based on the document type.

        Args:
            text (str): The text extracted from the document.
            document_type (str): The type of the document (e.g., 'invoice', 'lease').

        Returns:
            dict: Extracted information structured in a dictionary.
        """
        messages = self._generate_prompt_by_type(text, document_type)

        try:
            # Make an asynchronous request to OpenAI with the chat completion API
            response = await self.client.chat.completions.create(
                messages=messages,
                model="gpt-4o-mini",
                temperature=0.0,
            )

            # Extract content and remove any ```json markers
            content = response.choices[0].message.content.strip()
            if content.startswith("```json"):
                content = content[7:]  # Remove the starting ```json
            if content.endswith("```"):
                content = content[:-3]  # Remove the ending ```

            # Now attempt to parse the cleaned JSON string
            extracted_data = json.loads(content)
            return extracted_data

        except json.JSONDecodeError:
            logger.error("Error decoding JSON from OpenAI response.")
            return {}
        except Exception as e:
            logger.error(f"An error occurred while extracting information: {e}")
            return {}

    def _generate_prompt_by_type(self, text: str, document_type: str) -> list[ChatCompletionMessage]:
        """
        Generates a prompt based on the document type.  

        Args:
            text (str): The text extracted from the document.
            document_type (str): The type of the document (e.g., 'invoice', 'lease').

        Returns:
            list[ChatCompletionMessage]: The prompt formatted for OpenAI's ChatCompletion API.
        """
        # Generate the prompt based on document type
        if document_type.lower() == 'lease':
            return self._generate_lease_prompt(text)
        elif document_type.lower() == 'invoice':
            return self._generate_invoice_prompt(text)
        elif document_type.lower() == 'contract':
            return self._generate_contract_prompt(text)
        else:
            return self._generate_generic_prompt(text, document_type)

    def _generate_lease_prompt(self, text: str) -> list[ChatCompletionMessage]:
        """
        Generates a prompt for extracting key lease information in a specific JSON structure.
        """
        system_prompt = "You are an assistant that extracts lease information and formats it as JSON."
        user_prompt = (
            "Please extract the following details from the lease and return them in JSON format exactly as shown. "
            "If any information is missing, use 'Not Found' for that field. The 'Additional Fees' and 'Special Lease Terms' fields "
            "should include any relevant entries found in the document, not limited to specific examples.\n\n"
            "{"
            "  \"Lease Type\": \"Type of lease or contract\","
            "  \"Description\": \"High level, short description of document\","
            "  \"Rent Amount\": {"
            "    \"Total\": \"Total rent for the lease period\","
            "    \"Monthly Installment\": \"Monthly rent installment\""
            "  },"
            "  \"Security Deposit\": {"
            "    \"Amount\": \"Security deposit amount or 'Not Found' if absent\","
            "    \"Held By\": \"Entity holding the deposit or 'Not Found' if absent\""
            "  },"
            "  \"Start Date\": \"Start date of the lease\","
            "  \"End Date\": \"End date of the lease\","
            "  \"Tenant Information\": {"
            "    \"First Name\": \"First name of tenant\","
            "    \"Last Name\": \"Last name of tenant\","
            "    \"Landlord\": \"Name of landlord\","
            "    \"Address\": \"Tenant address\","
            "    \"Email\": \"Tenant email\","
            "    \"Phone Number\": \"Tenant phone number\","
            "    \"Date of Birth\": \"Tenant date of birth\""
            "  },"            
            "  \"Payment Frequency\": \"Frequency of rent payments (e.g., Monthly, Quarterly)\","
            "  \"Special Lease Terms\": {"
            "    \"Late Payment\": {"
            "      \"Initial Fee\": \"Initial late payment fee or 'Not Found' if absent\","
            "      \"Daily Late Charge\": \"Daily charge for late payment or 'Not Found' if absent\""
            "    },"
            "    \"Additional Fees\": ["
            "      {\"Fee Type\": \"Type of fee, e.g., 'After-Hours Lockout'\", \"Amount\": \"Fee amount\"},"
            "      {\"Fee Type\": \"Type of fee, e.g., 'Animal Violation'\", \"First Violation\": \"Amount for first violation\", \"Additional Violation\": \"Amount for subsequent violations\"},"
            "      {\"Fee Type\": \"Type of fee, e.g., 'Contract Re-Assignment'\", \"Amount\": \"Fee amount\"},"
            "      {\"Fee Type\": \"Type of fee, e.g., 'Garbage Removal'\", \"Amount\": \"Fee amount and applicable rate, e.g., '$50.00 per item/bag per day'\"},"
            "      {\"Fee Type\": \"Type of fee, e.g., 'Holdover Resident'\", \"Amount\": \"Fee amount and applicable rate, e.g., '150% of Daily Rate per day'\"}"
            "    ]"
            "  }"
            "}\n\n"
            f"Text to analyze:\n\n{text}"
        )
        
        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

    def _generate_invoice_prompt(self, text: str) -> list[ChatCompletionMessage]:
        """
        Generates a prompt for extracting key invoice information in a specific JSON structure.
        """
        system_prompt = "You are an assistant that extracts invoice information and formats it as JSON."
        user_prompt = (
            "Please extract the following details from the invoice and return them in JSON format exactly as shown. "
            "If any information is missing, use 'Not Found' for that field. For 'Line Items', list each item purchased with its details.\n\n"
            "{\n"
            "  \"Invoice Number\": \"Unique invoice number\",\n"
            "  \"Amount\": \"Total amount due\",\n"
            "  \"Paid Amount\": \"Amount already paid\",\n"
            "  \"Invoice Date\": \"Date of the invoice\",\n"
            "  \"Due Date\": \"Due date for payment\",\n"
            "  \"Status\": \"Status of the invoice (e.g., Unpaid, Paid)\",\n"
            "  \"Vendor Information\": {\n"
            "    \"Name\": \"Name of the vendor or supplier\",\n"
            "    \"Address\": \"Vendor address\"\n"
            "  },\n"
            "  \"Description\": \"Description of goods or services provided\",\n"
            "  \"Line Items\": [\n"
            "    {\n"
            "      \"Description\": \"Item description\",\n"
            "      \"Quantity\": \"Number of units\",\n"
            "      \"Unit Price\": \"Price per unit\",\n"
            "      \"Total Price\": \"Total price for this item\"\n"
            "    },\n"
            "    {\n"
            "      ...\n"
            "    }\n"
            "  ]\n"
            "}\n\n"
            f"Text to analyze:\n\n{text}"
        )

        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

    def _generate_contract_prompt(self, text: str) -> list[ChatCompletionMessage]:
        """
        Generates a prompt for extracting key contract information.
        """
        system_prompt = "You are an assistant that extracts contract details in JSON format."
        user_prompt = (
            "Extract the following contract details in JSON format:\n"
            "1. Contract type\n"
            "2. Start and end dates\n"
            "3. Parties involved\n"
            "4. Important clauses and terms\n\n"
            f"Text to analyze:\n\n{text}"
        )

        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

    def _generate_generic_prompt(self, text: str, document_type: str) -> list[ChatCompletionMessage]:
        """
        Generates a generic prompt for unspecified document types.
        """
        system_prompt = f"You are an assistant that extracts information from {document_type}s."
        user_prompt = (
            f"Extract the relevant information from the following {document_type} "
            f"and provide it in JSON format:\n\n{text}"
        )

        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]