from decimal import Decimal
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Invoice(Base):
    __tablename__ = "invoice"

    invoice_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customer.customer_id"), nullable=False)
    invoice_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    billing_address: Mapped[str | None] = mapped_column(String, nullable=True)
    billing_city: Mapped[str | None] = mapped_column(String, nullable=True)
    billing_state: Mapped[str | None] = mapped_column(String, nullable=True)
    billing_country: Mapped[str | None] = mapped_column(String, nullable=True)
    billing_postal_code: Mapped[str | None] = mapped_column(String, nullable=True)
    total: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    customer = relationship("Customer", back_populates="invoices")
    invoice_lines = relationship("InvoiceLine", back_populates="invoice")