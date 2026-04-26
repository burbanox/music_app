from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.purchase import (
    create_invoice_for_purchase,
    create_invoice_line_for_purchase,
    get_customer_by_id,
    get_track_by_id,
)
from app.models.user import User
from app.schemas.purchase import PurchaseCreate, PurchaseResponse


def create_purchase_service(
    db: Session,
    payload: PurchaseCreate,
    current_user: User,
) -> PurchaseResponse:
    customer = get_customer_by_id(db, current_user.customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with id {current_user.customer_id} not found",
        )

    track = get_track_by_id(db, payload.track_id)
    if not track:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Track with id {payload.track_id} not found",
        )

    try:
        invoice = create_invoice_for_purchase(
            db=db,
            customer=customer,
            total=track.unit_price,
        )

        invoice_line = create_invoice_line_for_purchase(
            db=db,
            invoice_id=invoice.invoice_id,
            track_id=track.track_id,
            unit_price=track.unit_price,
            quantity=1,
        )

        db.commit()

        return PurchaseResponse(
            message="Purchase completed successfully",
            invoice_id=invoice.invoice_id,
            invoice_line_id=invoice_line.invoice_line_id,
            track_id=track.track_id,
            customer_id=customer.customer_id,
            total=track.unit_price,
            purchase_date=invoice.invoice_date,
        )
    except Exception:
        db.rollback()
        raise