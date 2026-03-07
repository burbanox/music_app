from app.tests.conftest import (
    create_authenticated_user,
    get_test_client,
    login_test_user,
    promote_user_to_admin,
    register_test_user,
)


def test_register_user_success():
    client = get_test_client()

    payload = register_test_user(client)
    token = login_test_user(client, payload["email"], payload["password"])

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == payload["email"]
    assert data["full_name"] == payload["full_name"]
    assert data["customer_id"] == payload["customer_id"]
    assert data["role"] == "user"
    assert data["is_active"] is True


def test_register_user_duplicate_email_returns_400():
    client = get_test_client()

    first_payload = register_test_user(client)

    second_payload = {
        "email": first_payload["email"],
        "full_name": "Duplicate User",
        "password": "1234",
        "customer_id": first_payload["customer_id"] + 1,
    }

    response = client.post("/api/v1/auth/register", json=second_payload)

    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Email already registered"


def test_register_user_with_invalid_customer_returns_404():
    client = get_test_client()

    payload = {
        "email": "invalid_customer_test@example.com",
        "full_name": "Invalid Customer User",
        "password": "1234",
        "customer_id": 999999,
    }

    response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Customer with id 999999 not found"


def test_register_user_with_customer_already_linked_returns_400():
    client = get_test_client()

    first_payload = register_test_user(client)

    second_payload = {
        "email": "second_same_customer@example.com",
        "full_name": "Second Same Customer",
        "password": "1234",
        "customer_id": first_payload["customer_id"],
    }

    response = client.post("/api/v1/auth/register", json=second_payload)

    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "This customer is already linked to another user"


def test_login_success():
    client = get_test_client()

    payload = register_test_user(client)

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": payload["email"],
            "password": payload["password"],
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password_returns_401():
    client = get_test_client()

    payload = register_test_user(client)

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": payload["email"],
            "password": "wrong-password",
        },
    )

    assert response.status_code == 401
    data = response.json()
    assert data["detail"] == "Invalid email or password"


def test_get_me_with_valid_token():
    client = get_test_client()

    payload, token = create_authenticated_user(client)

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == payload["email"]
    assert data["full_name"] == payload["full_name"]
    assert data["customer_id"] == payload["customer_id"]
    assert data["role"] == "user"
    assert data["is_active"] is True


def test_get_me_without_token_returns_401_or_403():
    client = get_test_client()

    response = client.get("/api/v1/auth/me")

    assert response.status_code in [401, 403]


def test_admin_only_route_with_user_role_returns_403():
    client = get_test_client()
    _, token = create_authenticated_user(client)

    response = client.get(
        "/api/v1/auth/admin-only",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403
    data = response.json()
    assert data["detail"] == "You do not have permission to perform this action"


def test_admin_only_route_with_admin_role_returns_200():
    client = get_test_client()

    payload = register_test_user(client)
    promote_user_to_admin(payload["email"])
    token = login_test_user(client, payload["email"], payload["password"])

    response = client.get(
        "/api/v1/auth/admin-only",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Welcome admin"
    assert data["email"] == payload["email"]
    assert data["role"] == "admin"