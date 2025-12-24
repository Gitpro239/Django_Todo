import pytest
from rest_framework.test import APIClient


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_can_call_endpoint(client):
    response = client.get('/api/todos/')
    assert response.status_code == 200


@pytest.mark.django_db
def test_can_create_task(client):
    payload = {
        "title": "Fastapi",
        "description": "Learning Fastapi",
        "completed": False,
    }
    create_task_response = client.post('/api/todos/', payload, format='json')
    assert create_task_response.status_code == 201

    data = create_task_response.data
    task_id = data["id"]
    get_task_response = client.get(f"/api/todos/{task_id}/")

    assert get_task_response.status_code == 200
    get_task_data = get_task_response.data
    assert get_task_data["title"] == payload["title"]
    assert get_task_data["description"] == payload["description"]
    assert get_task_data["completed"] == payload["completed"]

##########################################################################################
@pytest.mark.django_db
def test_can_create_task_(client):
    payload = new_task_payload()
    create_task_response = client.post('/api/todos/', payload, format='json')
    assert  create_task_response.status_code == 201

    data =  create_task_response.data
    task_id = data["id"]
    get_task_response = client.get(f"/api/todos/{task_id}/")
    assert get_task_response.status_code == 200

    get_task_data = get_task_response.data
    assert get_task_data["title"] == payload["title"]
    assert get_task_data["description"] == payload["description"]
    assert get_task_data["completed"] == payload["completed"]

def new_task_payload():
    return {
        "title": "my test content",
        "description": "test description",
        "completed": False,
    }