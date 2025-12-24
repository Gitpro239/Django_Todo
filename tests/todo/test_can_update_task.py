import pytest
from rest_framework.test import APIClient


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_can_call_endpoint(client):
    update_task_response = client.get('/api/todos/')
    assert update_task_response.status_code == 200


@pytest.mark.django_db
def test_can_update_task(client):
    payload = new_task_payload()
    create_task_response = client.post('/api/todos/', payload, format='json')
    assert create_task_response.status_code == 201
    task_id = create_task_response.data['id']
    new_payload = {
        "title": "my updated content",
        "completed": True,
    }
    update_task_response = client.patch(f'/api/todos/{task_id}/', new_payload, format='json')
    assert update_task_response.status_code == 200
    get_task_response = client.get(f'/api/todos/{task_id}/')
    assert get_task_response.status_code == 200
    get_task_data = get_task_response.data
    assert get_task_data["title"] == new_payload["title"]
    assert get_task_data["completed"] == new_payload["completed"]


def new_task_payload():
    return {
        "title": "my test content",
        "description": "test description",
        "completed": False,
    }