import pytest
from rest_framework.test import APIClient
from todo.models import Task

@pytest.fixture
def client():
    return APIClient()

# ------------------------------------
# CREATE TESTS
# ------------------------------------
@pytest.mark.django_db
def test_create_todo_success(client):
    payload = {"title": "Buy Milk", "description": "From supermarket"}
    res = client.post("/api/todos/", payload, format="json")

    assert res.status_code == 201
    assert res.data["title"] == payload["title"]
    assert Task.objects.count() == 1


@pytest.mark.django_db
def test_create_todo_without_title(client):
    payload = {"description": "Missing title"}
    res = client.post("/api/todos/", payload, format="json")

    assert res.status_code == 400
    assert "title" in res.data


# ------------------------------------
# LIST TESTS
# ------------------------------------
@pytest.mark.django_db
def test_list_todos(client):
    Task.objects.create(title="Task A")
    Task.objects.create(title="Task B")

    res = client.get("/api/todos/")

    assert res.status_code == 200
    assert len(res.data) == 2


@pytest.mark.django_db
def test_list_empty_todos(client):
    res = client.get("/api/todos/")
    assert res.status_code == 200
    assert res.data == []


# ------------------------------------
# RETRIEVE TESTS
# ------------------------------------
@pytest.mark.django_db
def test_retrieve_todo_success(client):
    todo = Task.objects.create(title="Retrieve Test")

    res = client.get(f"/api/todos/{todo.id}/")

    assert res.status_code == 200
    assert res.data["title"] == "Retrieve Test"


@pytest.mark.django_db
def test_retrieve_invalid_id(client):
    res = client.get("/api/todos/999/")
    assert res.status_code == 404

# ------------------------------------
# UPDATE TESTS
# ------------------------------------
@pytest.mark.django_db
def test_update_todo_success(client):
    todo = Task.objects.create(title="Old Title")

    payload = {"title": "New Title"}
    res = client.patch(f"/api/todos/{todo.id}/", payload, format="json")

    assert res.status_code == 200
    assert res.data["title"] == payload["title"]


@pytest.mark.django_db
def test_update_todo_invalid_data(client):
    todo = Task.objects.create(title="Valid Title")

    payload = {"title": ""}
    res = client.patch(f"/api/todos/{todo.id}/", payload, format="json")

    assert res.status_code == 400
    assert "title" in res.data


# ------------------------------------
# DELETE TESTS
# ------------------------------------
@pytest.mark.django_db
def test_delete_todo_success(client):
    todo = Task.objects.create(title="Delete me")

    res = client.delete(f"/api/todos/{todo.id}/")
    assert res.status_code == 204
    assert Task.objects.count() == 0


@pytest.mark.django_db
def test_delete_invalid_id(client):
    res = client.delete("/api/todos/999/")
    assert res.status_code == 404


# ------------------------------------
# REPEAT CRUD TESTS USING payload + PARAMETRIZE
# ------------------------------------
@pytest.mark.django_db
@pytest.mark.parametrize("i", range(5))
def test_crud_cycle(client, i):
    # --- Create ---
    payload = {"title": f"Task {i}"}
    res = client.post("/api/todos/", payload, format="json")
    assert res.status_code == 201
    todo_id = res.data["id"]

    # --- Retrieve ---
    res = client.get(f"/api/todos/{todo_id}/")
    assert res.status_code == 200

    # --- Update ---
    payload = {"title": f"Updated {i}"}
    res = client.patch(f"/api/todos/{todo_id}/", payload, format="json")
    assert res.status_code == 200

    # --- Delete ---
    res = client.delete(f"/api/todos/{todo_id}/")
    assert res.status_code == 204
