"""API tests required by the assignment."""


def test_create_note_with_explicit_priority(client):
    response = client.post(
        "/notes",
        json={
            "title": "Experiment log",
            "body": "Measured sample A",
            "priority": "high",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Experiment log"
    assert data["body"] == "Measured sample A"
    assert data["priority"] == "high"
    assert "id" in data and data["id"]
    assert "created_at" in data and data["created_at"]


def test_invalid_priority_rejected(client):
    response = client.post(
        "/notes",
        json={
            "title": "Bad priority",
            "body": "Should fail validation",
            "priority": "urgent",
        },
    )

    # FastAPI/Pydantic validation error
    assert response.status_code == 422


def test_missing_note_returns_404(client):
    response = client.get("/notes/does-not-exist")

    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found"
