from app.tests.conftest import create_authenticated_user, get_test_client


def test_create_purchase_success():
    client = get_test_client()
    payload_user, token = create_authenticated_user(client)

    payload = {
        "track_id": 1,
    }

    response = client.post(
        "/api/v1/purchases",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Purchase completed successfully"
    assert data["track_id"] == 1
    assert data["customer_id"] == payload_user["customer_id"]
    assert "invoice_id" in data
    assert "invoice_line_id" in data
    assert "total" in data


def test_create_purchase_without_token_returns_401_or_403():
    client = get_test_client()

    payload = {
        "track_id": 1,
    }

    response = client.post("/api/v1/purchases", json=payload)

    assert response.status_code in [401, 403]


def test_create_purchase_with_invalid_track_returns_404():
    client = get_test_client()
    _, token = create_authenticated_user(client)

    payload = {
        "track_id": 999999,
    }

    response = client.post(
        "/api/v1/purchases",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "Track with id" in data["detail"]