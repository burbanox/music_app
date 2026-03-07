from sqlalchemy.orm import Session

from app.crud.song import search_songs
from app.schemas.song import SongSearchResponse


def search_songs_service(
    db: Session,
    name: str | None = None,
    artist: str | None = None,
    genre: str | None = None,
) -> SongSearchResponse:
    items = search_songs(db=db, name=name, artist=artist, genre=genre)

    return SongSearchResponse(
        items=items,
        total=len(items),
    )