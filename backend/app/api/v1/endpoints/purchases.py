from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_roles
from app.models.user import User
from app.schemas.purchase import PurchaseCreate, PurchaseResponse
from app.services.purchase_service import create_purchase_service

router = APIRouter(prefix="/purchases", tags=["purchases"])


@router.post(
    "",
    response_model=PurchaseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_purchase(
    payload: PurchaseCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_roles("user", "admin"))],
):
    return create_purchase_service(
        db=db,
        payload=payload,
        current_user=current_user,
    )