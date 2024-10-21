# app/api/endpoints/auth_routes.py

from fastapi import APIRouter, Depends, status, HTTPException
from starlette.requests import Request
from starlette.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.security import get_current_user
from app.core.auth.models import UserCreate, UserLogin, Token
from app.models.user import User
from app.core.auth.auth_service import signup_user, login_user
from app.core.auth.oauth import oauth
from app.core.auth.oauth_service import authenticate_oauth_user
from app.core.auth.auth_service import refresh_access_token
from app.core.config import settings
from jose import jwt
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Signup route
@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await signup_user(db, user.email, user.password)

# Login route
@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    return await login_user(db, user.email, user.password)

# OAuth login route for Google
@router.get("/login/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("auth_callback")  # Updated endpoint name
    logger.info(f"Generated redirect_uri: {redirect_uri}")
    print(f"Generated redirect_uri: {redirect_uri}")
    return await oauth.google.authorize_redirect(request, redirect_uri)

# OAuth callback route for Google login
@router.get("/callback", name="auth_callback")
async def auth_callback(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        # Retrieve the token from the OAuth flow
        token = await oauth.google.authorize_access_token(request)

        # Authenticate the user or create a new one in the system
        jwt_token = await authenticate_oauth_user(db, token)

        # Redirect to homepage or wherever you'd like the user to go after login
        response = RedirectResponse(url="/")  # You can change this URL to any post-login page

        # Set the JWT token as a cookie
        response.set_cookie(
            key="jwt_token",               # Custom cookie name
            value=jwt_token,               # The JWT token
            httponly=True,                 # Ensures cookie is only accessible via HTTP, protecting from JavaScript
            secure=True,                   # Use True in production to enforce HTTPS
            samesite="Lax"                 # Prevent CSRF for cross-site requests
        )

        return response

    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        logger.error(f"Error during Google OAuth: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication failed")

# Refresh Token Route
@router.post("/token/refresh", response_model=Token)
async def refresh_token(refresh_token: str):
    return await refresh_access_token(refresh_token)
