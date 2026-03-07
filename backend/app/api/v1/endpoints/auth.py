from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_roles
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, AuthResponse
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import login_user_service, register_user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    payload: UserCreate,
    db: Annotated[Session, Depends(get_db)],
):
    return register_user_service(db=db, payload=payload)


@router.post("/login", response_model=AuthResponse)
def login_user(
    payload: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
):
    return login_user_service(db=db, payload=payload)


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user


@router.get("/admin-only")
def admin_only_route(
    current_user: Annotated[User, Depends(require_roles("admin"))],
):
    return {
        "message": "Welcome admin",
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
    }