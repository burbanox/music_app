from fastapi import APIRouter

from app.core.config import settings
from app.core.database import check_database_connection

router = APIRouter()


@router.get("/health", tags=["health"])
def health_check():
    db_ok = check_database_connection()

    return {
        "status": "ok" if db_ok else "degraded",
        "app_name": settings.app_name,
        "environment": settings.app_env,
        "database": "connected" if db_ok else "disconnected",
    }