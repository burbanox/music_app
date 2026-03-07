from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.song import SongSearchResponse
from app.services.song_service import search_songs_service

router = APIRouter(prefix="/songs", tags=["songs"])


@router.get("/search", response_model=SongSearchResponse)
def search_songs_endpoint(
    db: Annotated[Session, Depends(get_db)],
    name: Annotated[str | None, Query(min_length=1)] = None,
    artist: Annotated[str | None, Query(min_length=1)] = None,
    genre: Annotated[str | None, Query(min_length=1)] = None,
):
    return search_songs_service(
        db=db,
        name=name,
        artist=artist,
        genre=genre,
    )