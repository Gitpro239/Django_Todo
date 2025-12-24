
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers
from todo.viewsJson import TodoViewSet

router = routers.DefaultRouter()
router.register(r"todos", TodoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('todo.urls')),
    path('', include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace='rest_framework')),

]

from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns += [
    path('api/jwt/', TokenObtainPairView.as_view(), name='jwt-obtain'),
    path('api/jwt/refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)