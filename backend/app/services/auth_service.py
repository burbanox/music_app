from datetime import timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.crud.user import create_user, get_available_customer, get_user_by_email
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, AuthResponse
from app.schemas.user import UserCreate


def register_user_service(db: Session, payload: UserCreate) -> AuthResponse:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    available_customer = get_available_customer(db)
    if not available_customer:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No available customers left to assign to new users",
        )

    hashed_password = get_password_hash(payload.password)

    user = create_user(
        db=db,
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hashed_password,
        customer_id=available_customer.customer_id,
    )

    # generate token for the newly created user
    access_token = create_access_token(
        subject=str(user.id),
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    return AuthResponse(access_token=access_token, user=user)


def login_user_service(db: Session, payload: LoginRequest) -> AuthResponse:
    user = get_user_by_email(db, payload.email)

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        subject=str(user.id),
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    return AuthResponse(access_token=access_token, user=user)