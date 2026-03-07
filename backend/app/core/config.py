from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Chinook API"
    app_env: str = "development"
    debug: bool = True

    api_v1_prefix: str = "/api/v1"

    postgres_server: str = "db"
    postgres_port: int = 5432
    postgres_db: str = "chinook"
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"

    database_url: str = "postgresql://postgres:postgres@db:5432/chinook"

    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    secret_key: str = "supersecretkey_change_this_in_production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    cors_origins: list[str] = ["http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",")]
        return value

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()