from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    get_object_or_404,
    DestroyAPIView,
    RetrieveAPIView,
)
from django.db import IntegrityError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate

from films.serializers import MovieSerializer
from users.serializers import (
    UserRegistrationSerializer,
    CurrentBookmarkSerializer,
)
from users.models import Bookmark
from films.models import Film
from users import extends_docs


@extends_docs.user_registration_schema
class UserRegistrationView(CreateAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = serializer.save()
        except IntegrityError:
            return Response(status=status.HTTP_409_CONFLICT)

        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        response_data = {
            **serializer.data,
            "refresh": str(refresh_token),
            "access": access_token,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


@extends_docs.login_schema
class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email:
            return Response(
                {"detail": "Не указан email."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not password:
            return Response(
                {"detail": "Не указан пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(email=email, password=password)
        if not user:
            return Response(
                {"detail": "Неверный логин или пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        response_data = {
            "access": access_token,
            "refresh": str(refresh_token),
        }

        return Response(response_data, status=status.HTTP_200_OK)


class BookmarkMovieListBaseView(ListAPIView):
    serializer_class = MovieSerializer
    bookmark_type = None

    def get_queryset(self):
        user = self.request.user
        return Film.objects.filter(
            bookmark__type=self.bookmark_type, bookmark__user=user
        )


class BookmarkCreateBaseView(CreateAPIView):
    bookmark_type = None
    serializer_class = None

    def get_object(self):
        movie_id = self.kwargs["movie_id"]
        movie = get_object_or_404(Film, id=movie_id)
        return movie

    def create(self, request, *args, **kwargs):
        movie = self.get_object()
        user = self.request.user
        user_bookmarks = Bookmark.objects.filter(user=user, film=movie)
        user_bookmarks.delete()
        new_bookmark = Bookmark(user=user, film=movie, type=self.bookmark_type)
        new_bookmark.save()
        return Response(status=status.HTTP_201_CREATED)


@extends_docs.bookmark_destroy_schema
class BookmarkDestroyView(DestroyAPIView):
    bookmark_type = None

    def get_object(self):
        movie = get_object_or_404(Film, id=self.kwargs["movie_id"])
        try:
            bookmark = Bookmark.objects.get(user=self.request.user, film=movie)
        except Bookmark.DoesNotExist:
            return None

        return bookmark

    def destroy(self, request, *args, **kwargs):
        bookmark = self.get_object()
        if bookmark is not None:
            self.perform_destroy(bookmark)
        return Response(status=status.HTTP_204_NO_CONTENT)


@extends_docs.current_bookmark_schema
class CurrentBookmarkView(RetrieveAPIView):
    serializer_class = CurrentBookmarkSerializer

    def get_object(self):
        movie = get_object_or_404(Film, id=self.kwargs["movie_id"])
        try:
            bookmark = Bookmark.objects.get(user=self.request.user, film=movie)
        except Bookmark.DoesNotExist:
            return None
        return bookmark

    def retrieve(self, request, *args, **kwargs):
        bookmark = self.get_object()
        if bookmark is None:
            type = None
            worth_bookmark = False
        else:
            type = bookmark.type
            worth_bookmark = True

        return Response(
            data={"type": type, "worth_bookmark": worth_bookmark},
            status=status.HTTP_200_OK,
        )


@extends_docs.like_create_schema
class LikeCreateView(BookmarkCreateBaseView):
    bookmark_type = "like"


@extends_docs.dislike_create_schema
class DislikeCreateView(BookmarkCreateBaseView):
    bookmark_type = "dislike"


@extends_docs.viewed_create_schema
class ViewedCreateView(BookmarkCreateBaseView):
    bookmark_type = "viewed"


@extends_docs.aside_create_schema
class AsideCreateView(BookmarkCreateBaseView):
    bookmark_type = "aside"


@extends_docs.like_list_schema
class LikeListView(BookmarkMovieListBaseView):
    bookmark_type = "like"


@extends_docs.dislike_list_schema
class DislikeListView(BookmarkMovieListBaseView):
    bookmark_type = "dislike"


@extends_docs.viewed_list_schema
class ViewedListView(BookmarkMovieListBaseView):
    bookmark_type = "viewed"


@extends_docs.aside_list_schema
class AsideListView(BookmarkMovieListBaseView):
    bookmark_type = "aside"


@extends_docs.logout_schema
class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        token = request.data.get("refresh")
        if not token:
            return Response(
                {"error": "need token"}, status=status.HTTP_400_BAD_REQUEST
            )
        refresh_token = RefreshToken(token)
        refresh_token.blacklist()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DeleteUserView(APIView):

    @extends_docs.delete_user_schema
    def delete(self, request, *args, **kwargs):
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@extends_docs.movie_local_schema
class MovieLocalView(ListAPIView):
    serializer_class = MovieSerializer

    def get_queryset(self):
        return Film.objects.filter(user=self.request.user)
