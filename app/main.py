# app/main.py

from fastapi import FastAPI, HTTPException
from .schemas import PropertyRequest, PropertyInfo
from .config import settings
import httpx
from urllib.parse import urlencode
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI(
    title="Propaya Property Information API",
    description="API to fetch property information and images based on address input.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("uvicorn.error")

@app.post("/property/", response_model=PropertyInfo)
async def get_property_info(property_request: PropertyRequest):
    address = property_request.address.strip()
    if not address:
        logger.warning("Address is missing in the request.")
        raise HTTPException(status_code=400, detail="Address is required.")

    # Fetch property data from Regrid API
    regrid_url = "https://app.regrid.com/api/v2/parcels/address"
    regrid_params = {
        "query": address,  # Full address
        "token": settings.REGRID_API_KEY  # Regrid API token
    }

    logger.info(f"Requesting property info for address: {address}")
    logger.info(f"Using Regrid API Token: {settings.REGRID_API_KEY}")
    logger.info(f"Request URL: {regrid_url}")
    logger.info(f"Request Parameters: {regrid_params}")

    headers = {
        "Accept": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            # Make GET request to Regrid API
            regrid_response = await client.get(regrid_url, params=regrid_params, headers=headers)
            logger.info(f"Regrid API response status: {regrid_response.status_code}")
            regrid_response.raise_for_status()
        except httpx.RequestError as e:
            logger.error(f"RequestError while fetching Regrid API: {e}")
            raise HTTPException(status_code=503, detail="Regrid API service unavailable.")
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTPStatusError: {regrid_response.status_code} - {regrid_response.text}")
            if regrid_response.status_code == 404:
                logger.warning(f"Property not found for address: {address}")
                raise HTTPException(status_code=404, detail="Property not found.")
            elif regrid_response.status_code == 401:
                logger.error("Unauthorized: Check your Regrid API token.")
                raise HTTPException(status_code=401, detail="Unauthorized: Check your Regrid API token.")
            else:
                raise HTTPException(status_code=regrid_response.status_code, detail="Error fetching property data.")

    # Parse the Regrid response
    regrid_data = regrid_response.json()
    logger.info(f"Regrid API response for address '{address}': {regrid_data}")

    parcels = regrid_data.get("parcels", {}).get("features", [])
    if not parcels:
        logger.warning(f"No parcels found in Regrid response for address: {address}")
        raise HTTPException(status_code=404, detail="Property not found.")

    # Extract properties from the first parcel
    first_parcel = parcels[0]
    property_properties = first_parcel.get("properties", {})

    # Log extracted property data
    logger.info(f"Property data: {property_properties}")

    property_type = property_properties.get("property_type")
    price = property_properties.get("market_value")
    lot_size = property_properties.get("lot_size")
    zoning_info = property_properties.get("zoning")
    existing_structures = property_properties.get("structures")
    environmental_data = property_properties.get("environmental")

    # Fetch image separately from Google Street View API
    street_view_base_url = "https://maps.googleapis.com/maps/api/streetview"
    street_view_params = {
        "size": "600x400",  # Image size
        "location": address,
        "fov": "80",  # Field of view
        "heading": "70",  # Direction the camera is facing
        "pitch": "0",  # Camera angle
        "key": settings.GOOGLE_STREET_VIEW_API_KEY
    }

    # Construct the image URL
    street_view_query = urlencode(street_view_params)
    image_url = f"{street_view_base_url}?{street_view_query}"

    # Optionally, verify if the image exists by sending a request to Google
    async with httpx.AsyncClient() as client:
        try:
            img_response = await client.head(image_url)
            if img_response.status_code != 200:
                logger.info(f"Street View image not found for address: {address}, using default image.")
                image_url = "https://example.com/default-image.png"  # Replace with your default image URL
        except httpx.RequestError as e:
            logger.error(f"RequestError while fetching Street View image: {e}")
            image_url = "https://example.com/default-image.png"  # Replace with your default image URL

    return PropertyInfo(
        address=address,
        property_type=property_type,
        price=price,
        lot_size=lot_size,
        zoning_info=zoning_info,
        existing_structures=existing_structures,
        environmental_data=environmental_data,
        image_url=image_url
    )
