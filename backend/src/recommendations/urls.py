from django.urls import path

from .views import SimiliarView, RecommendedFilmsView, WishView

urlpatterns = [
    path("ai/similiar/", SimiliarView.as_view(), name="similiar"),
    path("ai/wish/", WishView.as_view(), name="wish"),
    path(
        "default/",
        RecommendedFilmsView.as_view(),
        name="default_recommendations",
    ),
]
