from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.album import Album
from app.models.artist import Artist
from app.models.genre import Genre
from app.models.track import Track


def search_songs(
    db: Session,
    name: str | None = None,
    artist: str | None = None,
    genre: str | None = None,
) -> list[dict]:
    stmt = (
        select(
            Track.track_id,
            Track.name.label("track_name"),
            Track.unit_price,
            Artist.name.label("artist_name"),
            Genre.name.label("genre_name"),
            Album.title.label("album_title"),
        )
        .select_from(Track)
        .join(Album, Track.album_id == Album.album_id, isouter=True)
        .join(Artist, Album.artist_id == Artist.artist_id, isouter=True)
        .join(Genre, Track.genre_id == Genre.genre_id, isouter=True)
    )

    if name:
        stmt = stmt.where(Track.name.ilike(f"%{name}%"))

    if artist:
        stmt = stmt.where(Artist.name.ilike(f"%{artist}%"))

    if genre:
        stmt = stmt.where(Genre.name.ilike(f"%{genre}%"))

    stmt = stmt.order_by(Track.name.asc())

    rows = db.execute(stmt).all()

    return [
        {
            "track_id": row.track_id,
            "name": row.track_name,
            "artist": row.artist_name,
            "genre": row.genre_name,
            "album": row.album_title,
            "unit_price": row.unit_price,
        }
        for row in rows
    ]