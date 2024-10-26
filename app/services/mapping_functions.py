# app/services/mapping_functions.py

import json
import logging

# Initialize logger for this module
logger = logging.getLogger(__name__)

def normalize_keys(d):
    """
    Recursively normalizes the keys of the dictionary: strip whitespace, convert to lowercase,
    replace spaces with underscores.

    Args:
        d (dict): The dictionary to normalize.

    Returns:
        dict: A new dictionary with normalized keys.
    """
    new_dict = {}
    for key, value in d.items():
        if isinstance(key, str):
            new_key = key.strip().lower().replace(' ', '_')
        else:
            new_key = key
        if isinstance(value, dict):
            new_value = normalize_keys(value)
        elif isinstance(value, list):
            new_value = [normalize_keys(item) if isinstance(item, dict) else item for item in value]
        else:
            new_value = value
        new_dict[new_key] = new_value
    return new_dict

def parse_json(raw_json: str) -> dict:
    """
    Parses and validates the JSON string response from OpenAI, normalizes keys,
    and ensures consistent structure for mapping.

    Args:
        raw_json (str): The raw JSON string from OpenAI.

    Returns:
        dict: A structured dictionary with normalized keys.
    """
    try:
        extracted_data = json.loads(raw_json)
    except json.JSONDecodeError:
        logger.error("Failed to parse JSON response.")
        return {}

    # Normalize keys
    parsed_data = normalize_keys(extracted_data)
    return parsed_data

def map_lease_data(parsed_data: dict) -> dict:
    """
    Maps the parsed data to the Lease model fields.

    Args:
        parsed_data (dict): The data parsed by `parse_json`.

    Returns:
        dict: A dictionary of Lease fields ready to be used for creation.
    """
    # Helper function to safely get nested values
    def get_nested_value(data, keys, default="Not Found"):
        for key in keys:
            if isinstance(data, dict) and key in data:
                data = data[key]
            else:
                return default
        return data

    lease_data = {
        "lease_type": parsed_data.get("lease_type", "Not Found"),
        "rent_amount_total": get_nested_value(parsed_data, ["rent_amount", "total"], "Not Found"),
        "rent_amount_monthly": get_nested_value(parsed_data, ["rent_amount", "monthly_installment"], "Not Found"),
        "security_deposit_amount": get_nested_value(parsed_data, ["security_deposit", "amount"], "Not Found"),
        "security_deposit_held_by": get_nested_value(parsed_data, ["security_deposit", "held_by"], "Not Found"),
        "start_date": parsed_data.get("start_date", "Not Found"),
        "end_date": parsed_data.get("end_date", "Not Found"),
        "payment_frequency": parsed_data.get("payment_frequency", "Not Found"),
        "tenant_info": parsed_data.get("tenant_information", {}),
        "special_lease_terms": parsed_data.get("special_lease_terms", {}),
        "is_active": True  # Default value; adjust if necessary
    }

    return lease_data

