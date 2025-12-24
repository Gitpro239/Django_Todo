import pytest
from rest_framework.test import APIClient


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_can_call_endpoint(client):
    get_task_response = client.get('/api/todos/')
    assert get_task_response.status_code == 200


@pytest.mark.django_db
def test_can_get_task(client):
    payload = new_task_payload()
    create_task_response = client.post('/api/todos/', payload, format='json')
    assert create_task_response.status_code == 201
    task_id = create_task_response.data['id']

    get_task_response = client.get(f'/api/todos/{task_id}/')
    assert get_task_response.status_code == 200
    print(get_task_response.data)


def new_task_payload():
    return {
        "title": "my test content",
        "description": "test description",
        "completed": False,
    }
