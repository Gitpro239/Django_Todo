import pytest
from rest_framework.test import APIClient
import uuid


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_can_call_endpoint(client):
    list_task_response = client.get('/api/todos/')
    assert list_task_response.status_code == 200


@pytest.mark.django_db
def test_can_list_tasks(client):
    # ensure no tasks
    # create one task
    n = 1
    for _ in range(n):
        payload = new_task_payload()
        create_task_response = client.post('/api/todos/', payload, format='json')
        assert create_task_response.status_code == 201

    list_task_response = client.get('/api/todos/')
    assert list_task_response.status_code == 200
    data = list_task_response.data
    # data may be list or paginated dict
    if hasattr(data, 'get'):
        items = data.get('results', [])
    else:
        items = data
    assert len(items) >= n


def new_task_payload():
    title = f"test_task_{uuid.uuid4().hex}"
    description = f"test_description_{uuid.uuid4().hex}"
    print(f"creating task {title} with description{description}")
    return {
        "title": title,
        "description": description,
        "completed": False,
    }