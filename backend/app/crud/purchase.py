from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.invoice_line import InvoiceLine
from app.models.track import Track


def get_customer_by_id(db: Session, customer_id: int) -> Customer | None:
    return db.get(Customer, customer_id)


def get_track_by_id(db: Session, track_id: int) -> Track | None:
    return db.get(Track, track_id)


def get_next_invoice_id(db: Session) -> int:
    max_id = db.execute(select(func.max(Invoice.invoice_id))).scalar()
    return 1 if max_id is None else max_id + 1


def get_next_invoice_line_id(db: Session) -> int:
    max_id = db.execute(select(func.max(InvoiceLine.invoice_line_id))).scalar()
    return 1 if max_id is None else max_id + 1


def create_invoice_for_purchase(
    db: Session,
    customer: Customer,
    total,
) -> Invoice:
    invoice = Invoice(
        invoice_id=get_next_invoice_id(db),
        customer_id=customer.customer_id,
        invoice_date=datetime.now(),
        billing_address=customer.address,
        billing_city=customer.city,
        billing_state=customer.state,
        billing_country=customer.country,
        billing_postal_code=customer.postal_code,
        total=total,
    )
    db.add(invoice)
    db.flush()
    return invoice


def create_invoice_line_for_purchase(
    db: Session,
    invoice_id: int,
    track_id: int,
    unit_price,
    quantity: int = 1,
) -> InvoiceLine:
    invoice_line = InvoiceLine(
        invoice_line_id=get_next_invoice_line_id(db),
        invoice_id=invoice_id,
        track_id=track_id,
        unit_price=unit_price,
        quantity=quantity,
    )
    db.add(invoice_line)
    db.flush()
    return invoice_line