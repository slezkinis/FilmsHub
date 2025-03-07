from django.db.models import Q
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import RetrieveAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError

from films.models import Director, Actor, Film
from films import serializers, extends_docs
from core.views import SearchMixin, BaseSearchListView


class FilmsViewSet(SearchMixin, ModelViewSet):
    serializer_class = serializers.MovieSerializer
    queryset = Film.objects.all()
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        year_start = self.request.query_params.get("year_start", -1)
        year_end = self.request.query_params.get("year_end", -1)
        list_of_types = self.request.query_params.get("list_of_types", "")
        list_of_actors = self.request.query_params.get("list_of_actors", "")
        director = self.request.query_params.get("director", "")
        list_of_genres = self.request.query_params.get("list_of_genres", "")
        list_of_countries = self.request.query_params.get(
            "list_of_countries", ""
        )
        try:
            year_start = int(year_start)
            year_end = int(year_end)
            list_of_types = str(list_of_types)
            list_of_actors = str(list_of_actors)
            director = str(director)
            list_of_genres = str(list_of_genres)
            list_of_countries = str(list_of_countries)
        except ValueError:
            raise ValidationError("Неверные данные")
        query = Q()

        if user.is_authenticated:
            query &= Q(user=user) | Q(user__isnull=True)
        else:
            query &= Q(user__isnull=True)
        if year_start != -1:
            query &= Q(year__gte=year_start)
        if year_end != -1:
            query &= Q(year__lte=year_end)
        if list_of_actors != "":
            actor_query = Q()
            for name in director.split(","):
                actor_query |= Q(actors__name__icontains=name)
            query &= actor_query
        if director != "":
            director_query = Q()
            for name in director.split(","):
                director_query |= Q(director__name__icontains=name)
            query &= director_query
        if list_of_genres != "":
            query &= Q(genres__overlap=list_of_genres.split(","))
        if list_of_countries != "":
            query &= Q(countries__overlap=list_of_countries.split(","))
        if list_of_types != "":
            query &= Q(type__in=list_of_types.split(","))
        queryset = queryset.filter(query)
        queryset = queryset.filter(query).order_by("-rating")
        return queryset

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied
        instance.delete()

    def get_permissions(self):
        if self.action in ["create", "destroy"]:
            return [IsAuthenticated()]
        return [AllowAny()]

    @extends_docs.films_list_docs
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extends_docs.films_create_docs
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extends_docs.films_retrieve_docs
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extends_docs.films_destroy_docs
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


@extends_docs.actor_list_docs
class ActorListView(BaseSearchListView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = serializers.ActorIdSerializer
    queryset = Actor.objects.all().order_by("id")


@extends_docs.actor_retrieve_docs
class ActorRetrieveView(RetrieveAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = serializers.ActorIdSerializer
    queryset = Actor.objects.all()
    lookup_url_kwarg = "actor_id"


@extends_docs.director_list_docs
class DirectorListView(BaseSearchListView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = serializers.DirectorIdSerializer
    queryset = Director.objects.all().order_by("id")


@extends_docs.director_retrieve_docs
class DirectorRetrieveView(RetrieveAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = serializers.DirectorIdSerializer
    queryset = Director.objects.all()
    lookup_url_kwarg = "director_id"


class GenresView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extends_docs.genres_list_docs
    def get(self, request):
        genres = []
        for movie in Film.objects.all():
            genres += movie.genres
        return Response(list(set(genres)), status=status.HTTP_200_OK)
