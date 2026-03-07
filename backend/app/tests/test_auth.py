import uuid

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.main import app
from app.db.session import SessionLocal
from app.models.user import User


def get_test_client() -> TestClient:
    return TestClient(app)


def create_random_user_payload() -> dict:
    unique_id = uuid.uuid4().hex[:8]
    return {
        "email": f"testuser_{unique_id}@example.com",
        "full_name": f"Test User {unique_id}",
        "password": "1234",
    }


def register_test_user(client: TestClient) -> dict:
    payload = create_random_user_payload()
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201, response.text

    data = response.json()
    payload["customer_id"] = data["user"]["customer_id"]
    return payload


def login_test_user(client: TestClient, email: str, password: str) -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )
    assert response.status_code == 200, response.text
    data = response.json()
    return data["access_token"]


def create_authenticated_user(client: TestClient) -> tuple[dict, str]:
    payload = register_test_user(client)
    token = login_test_user(client, payload["email"], payload["password"])
    return payload, token


def promote_user_to_admin(email: str) -> None:
    db = SessionLocal()
    try:
        stmt = select(User).where(User.email == email)
        user = db.execute(stmt).scalar_one()
        user.role = "admin"
        db.commit()
    finally:
        db.close()