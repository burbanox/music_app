from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class InvoiceLine(Base):
    __tablename__ = "invoice_line"

    invoice_line_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    invoice_id: Mapped[int] = mapped_column(ForeignKey("invoice.invoice_id"), nullable=False)
    track_id: Mapped[int] = mapped_column(ForeignKey("track.track_id"), nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    invoice = relationship("Invoice", back_populates="invoice_lines")
    track = relationship("Track", back_populates="invoice_lines")