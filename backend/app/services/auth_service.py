from datetime import timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.crud.user import create_user, get_user_by_customer_id, get_user_by_email
from app.models.customer import Customer
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate


def register_user_service(db: Session, payload: UserCreate) -> User:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    existing_customer = db.get(Customer, payload.customer_id)
    if not existing_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with id {payload.customer_id} not found",
        )

    existing_user_for_customer = get_user_by_customer_id(db, payload.customer_id)
    if existing_user_for_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This customer is already linked to another user",
        )

    hashed_password = get_password_hash(payload.password)

    return create_user(
        db=db,
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hashed_password,
        customer_id=payload.customer_id,
    )


def login_user_service(db: Session, payload: LoginRequest) -> TokenResponse:
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

    return TokenResponse(access_token=access_token)