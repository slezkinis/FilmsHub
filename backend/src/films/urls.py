from django.urls import path, include
from rest_framework.routers import DefaultRouter
from films import views

movie_router = DefaultRouter()
movie_router.register("", views.FilmsViewSet, basename="movie_viewset")


urlpatterns = [
    path("actors/", views.ActorListView.as_view()),
    path("genres/", views.GenresView.as_view()),
    path("directors/", views.DirectorListView.as_view()),
    path("actors/<int:actor_id>/", views.ActorRetrieveView.as_view()),
    path("directors/<int:director_id>/", views.DirectorRetrieveView.as_view()),
    path("", include(movie_router.urls)),
]
