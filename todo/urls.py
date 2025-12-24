from django.urls import path
from .viewsJson import TodoListCreate, TodoRetrieveUpdateDelete
from .viewsJson import task_list, task_detail
from .viewsJson import TaskListCreateView, TaskDetailView
from .import views

urlpatterns = [
    path('todos/', TodoListCreate.as_view(), name="todo-list"),
    path('todos/<int:pk>/', TodoRetrieveUpdateDelete.as_view(), name="todo-detail"),
   
    path('api/tasks/', task_list),
    path('api/tasks/<int:pk>/', task_detail),

    path('url/tasks/', TaskListCreateView.as_view()),
    path('url/tasks/<int:pk>/', TaskDetailView.as_view()),


    path('home', views.homePage),
    path('list', views.task_list, name="task_list"),
    path('create', views.task_create, name="task_create"),
    path('detail/<int:pk>', views.task_detail, name="task_detail"),
    path('update/<int:pk>', views.task_update, name="task_update" ),
    path('delete/<int:pk>', views.task_delete, name="task_delete"),
]
