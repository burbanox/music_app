from pydantic import BaseModel, ConfigDict


class SongItem(BaseModel):
    track_id: int
    name: str
    artist: str | None = None
    genre: str | None = None
    album: str | None = None
    unit_price: float

    model_config = ConfigDict(from_attributes=True)


class SongSearchResponse(BaseModel):
    items: list[SongItem]
    total: int