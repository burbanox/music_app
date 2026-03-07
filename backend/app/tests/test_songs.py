from app.tests.conftest import get_test_client


def test_search_songs_returns_200():
    client = get_test_client()

    response = client.get("/api/v1/songs/search")

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)
    assert isinstance(data["total"], int)


def test_search_songs_by_artist_returns_results():
    client = get_test_client()

    response = client.get("/api/v1/songs/search?artist=AC/DC")

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)


def test_search_songs_by_genre_returns_results():
    client = get_test_client()

    response = client.get("/api/v1/songs/search?genre=Rock")

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data


def test_search_songs_with_unknown_filter_returns_valid_structure():
    client = get_test_client()

    response = client.get("/api/v1/songs/search?artist=artist_that_should_not_exist_12345")

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)
    assert isinstance(data["total"], int)