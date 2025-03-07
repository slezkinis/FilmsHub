from rest_framework.test import APITestCase
from rest_framework import status

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from films.models import (
    Actor,
    Film,
    Director,
)


class TestUsers(APITestCase):
    def setUp(self):
        self.incorrect_users = [
            {},
            {"email": "test@test.ru"},
            {"password": "sfdjslndfnsldf"},
            {"email": "test@test.ru", "password": "1"},
            {"email": "test", "password": "fdsfasdfsad"},
            {"email": "test@test.ru", "password": "12341234"},
        ]

        self.correct_user_1 = {
            "email": "test6@test.ru",
            "password": "vnkdjfkvndfv",
        }
        self.correct_user_2 = {
            "email": "test2@test.ru",
            "password": "vnkdjfkvndfv",
        }

        self.incorrect_users_login = [
            {},
            {"email": "test@test.ru"},
            {"password": "sfdjslndfnsldf"},
            {"email": "test", "password": "fdsfasdfsad"},
        ]
        self.bookmarks_urls = [
            "bookmarks/aside/",
            "bookmarks/like/",
            "bookmarks/dislike/",
            "bookmarks/view/",
        ]
        self.sign_up_url = "/api/users/auth/sign-up/"
        self.login_url = "/api/users/auth/login/"

        self.director = Director.objects.create(name="test")
        self.actor = Actor.objects.create(name="test")
        self.film = Film.objects.create(
            name="test",
            poster="http://example.com/poster.jpg",
            rating=8.5,
            year=2020,
            genres=["Action", "Adventure"],
            director=self.director,
        )
        self.film.actors.set([self.actor])
        self.film.save()

    def test_invalid_create(self):
        for incorrect_user in self.incorrect_users:
            with self.subTest(incorrect_user=incorrect_user):
                response = self.client.post(
                    self.sign_up_url, data=incorrect_user, format="json"
                )
                self.assertEqual(
                    response.status_code, status.HTTP_400_BAD_REQUEST
                )

    def test_simple_create(self):
        response = self.client.post(
            self.sign_up_url, data=self.correct_user_1, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_conflict_create(self):
        with self.subTest(correct_user_2=self.correct_user_2):
            response = self.client.post(
                self.sign_up_url, data=self.correct_user_2, format="json"
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            response2 = self.client.post(
                self.sign_up_url, data=self.correct_user_2, format="json"
            )
            self.assertEqual(
                response2.status_code, status.HTTP_400_BAD_REQUEST
            )

    def test_invalid_login(self):
        for incorrect_user in self.incorrect_users_login:
            with self.subTest(incorrect_user=incorrect_user):
                response = self.client.post(
                    self.login_url, data=incorrect_user, format="json"
                )
                self.assertEqual(
                    response.status_code, status.HTTP_400_BAD_REQUEST
                )

    def test_simple_login(self):
        with self.subTest(correct_user_1=self.correct_user_1):
            response = self.client.post(
                self.sign_up_url, data=self.correct_user_1, format="json"
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            response = self.client.post(
                self.login_url, data=self.correct_user_1, format="json"
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_bookmarks(self):
        with self.subTest():
            response = self.client.post(
                self.sign_up_url, data=self.correct_user_1, format="json"
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            user = authenticate(**self.correct_user_1)
            access_token = str(RefreshToken.for_user(user).access_token)

            self.client.credentials(
                HTTP_AUTHORIZATION=f"Bearer {access_token}"
            )
            for bookmark_url in self.bookmarks_urls:
                response = self.client.post(
                    f"/api/users/movies/{self.film.id}/{bookmark_url}",
                    data={},
                )
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_bookmarks_without_token(self):
        for bookmark_url in self.bookmarks_urls:
            response = self.client.post(
                f"/api/users/movies/{self.film.id}/{bookmark_url}",
                data={},
            )
            self.assertEqual(
                response.status_code, status.HTTP_401_UNAUTHORIZED
            )

    def test_bookmarks_404(self):
        with self.subTest():
            response = self.client.post(
                self.sign_up_url, data=self.correct_user_1, format="json"
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            user = authenticate(**self.correct_user_1)
            access_token = str(RefreshToken.for_user(user).access_token)

            self.client.credentials(
                HTTP_AUTHORIZATION=f"Bearer {access_token}"
            )
            for bookmark_url in self.bookmarks_urls:
                response = self.client.post(
                    f"/api/users/movies/0/{bookmark_url}",
                    data={},
                )
                self.assertEqual(
                    response.status_code, status.HTTP_404_NOT_FOUND
                )
