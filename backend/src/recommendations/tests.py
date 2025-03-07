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
        self.correct_user_1 = {
            "email": "test6@test.ru",
            "password": "vnkdjfkvndfv",
        }

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

    def test_default_recommendations(self):
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

            response = self.client.get(
                "/api/recommend/default/",
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_parameters(self):
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

            response = self.client.get(
                "/api/recommend/default/?page=-1",
            )
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
