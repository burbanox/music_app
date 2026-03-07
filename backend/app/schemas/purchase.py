from decimal import Decimal

from pydantic import BaseModel, Field


class PurchaseCreate(BaseModel):
    track_id: int = Field(..., gt=0)


class PurchaseResponse(BaseModel):
    message: str
    invoice_id: int
    invoice_line_id: int
    track_id: int
    customer_id: int
    total: Decimal