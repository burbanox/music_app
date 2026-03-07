import uuid

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.main import app
from app.db.session import SessionLocal
from app.models.customer import Customer
from app.models.user import User


def get_test_client() -> TestClient:
    return TestClient(app)


def get_available_customer_id() -> int:
    db = SessionLocal()
    try:
        used_customer_ids = db.execute(select(User.customer_id)).scalars().all()

        stmt = select(Customer.customer_id).order_by(Customer.customer_id.asc())

        if used_customer_ids:
            stmt = stmt.where(Customer.customer_id.not_in(used_customer_ids))

        customer_id = db.execute(stmt).scalars().first()

        if customer_id is None:
            raise RuntimeError("No available customers left for tests")

        return customer_id
    finally:
        db.close()


def create_random_user_payload(customer_id: int | None = None) -> dict:
    unique_id = uuid.uuid4().hex[:8]

    if customer_id is None:
        customer_id = get_available_customer_id()

    return {
        "email": f"testuser_{unique_id}@example.com",
        "full_name": f"Test User {unique_id}",
        "password": "1234",
        "customer_id": customer_id,
    }


def register_test_user(client: TestClient, customer_id: int | None = None) -> dict:
    payload = create_random_user_payload(customer_id=customer_id)
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201, response.text
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


def create_authenticated_user(client: TestClient, customer_id: int | None = None) -> tuple[dict, str]:
    payload = register_test_user(client, customer_id=customer_id)
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