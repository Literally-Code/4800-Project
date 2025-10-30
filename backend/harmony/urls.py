# harmony/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet, song_search, SongViewSet, spotify_callback, spotify_login, matches
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'songs', SongViewSet, basename='song')
urlpatterns = [
    path('', include(router.urls)),
    path('search/', song_search),
    path('spotify-auth/login/', spotify_login),
    path('spotify-auth/callback/', spotify_callback),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # to obtain token
    path('matches/', matches, name='matches'),
]
