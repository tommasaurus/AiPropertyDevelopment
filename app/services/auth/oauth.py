# /services/auth/oauth.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security.oauth2 import OAuth2AuthorizationCodeBearer
from starlette import OAuth
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import RedirectResponse
from jose import jwt

# Secret key, algorithm, and other configurations for JWT tokens
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

# Initialize OAuth configuration
config = Config(".env")  # Load OAuth settings from a .env file (or set directly)
oauth = OAuth(config)

# Add OAuth2 provider (e.g., Google)
oauth.register(
    name='google',
    client_id='your_google_client_id',
    client_secret='your_google_client_secret',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    refresh_token_url=None,
    client_kwargs={'scope': 'openid email profile'},
)

router = APIRouter()

@router.get("/login/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("auth")  # Redirect back after OAuth login
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth")
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = await oauth.google.parse_id_token(request, token)
    
    # Generate a JWT token for your FastAPI app
    jwt_token = jwt.encode({"sub": user["email"]}, SECRET_KEY, algorithm=ALGORITHM)
    
    # Return a redirect with the generated JWT token (or return a response)
    response = RedirectResponse(url="/")
    response.set_cookie("Authorization", f"Bearer {jwt_token}")
    return response
