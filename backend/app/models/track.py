from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Track(Base):
    __tablename__ = "track"

    track_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    album_id: Mapped[int | None] = mapped_column(ForeignKey("album.album_id"), nullable=True)
    genre_id: Mapped[int | None] = mapped_column(ForeignKey("genre.genre_id"), nullable=True)
    composer: Mapped[str | None] = mapped_column(String, nullable=True)
    milliseconds: Mapped[int] = mapped_column(Integer, nullable=False)
    bytes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    album = relationship("Album", back_populates="tracks")
    genre = relationship("Genre", back_populates="tracks")
    invoice_lines = relationship("InvoiceLine", back_populates="track")