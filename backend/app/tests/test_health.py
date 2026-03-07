from app.tests.conftest import get_test_client


def test_health_endpoint_returns_200():
    client = get_test_client()

    response = client.get("/api/v1/health")

    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert "app_name" in data