import app.models
from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.db.init_db import init_db

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)


@app.on_event("startup")
def on_startup():
    init_db()


app.include_router(api_router)


@app.get("/", tags=["root"])
def read_root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "docs_url": "/docs",
    }