from rest_framework.test import APITestCase
from rest_framework import status

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from films.models import (
    Actor,
    Film,
    Director,
)


class TestMovies(APITestCase):
    def setUp(self):
        self.correct_user_1 = {
            "email": "test6@test.ru",
            "password": "vnkdjfkvndfv",
        }

        self.sign_up_url = "/api/users/auth/sign-up/"
        self.login_url = "/api/users/auth/login/"

        self.query_params_movies = [
            "?director=test",
            "?actor=test",
            "?list_of_genres=Action,Adventure",
            "?list_of_types=movie",
            "?year_end=2024",
            "?year_start=2020",
        ]

        self.director = Director.objects.create(name="test")
        self.actor = Actor.objects.create(name="test")
        self.film = Film.objects.create(
            name="film1",
            poster="http://example.com/poster.jpg",
            rating=8.5,
            year=2020,
            genres=["Action", "Adventure"],
            director=self.director,
        )
        self.film.actors.set([self.actor])
        self.film.save()

        self.film2 = Film.objects.create(
            name="film2",
            poster="http://example.com/poster.jpg",
            rating=8.5,
            year=2020,
            genres=["Action", "Adventure"],
            director=self.director,
        )
        self.film2.actors.set([self.actor])
        self.film2.save()

        self.incorrect_films = [
            {
                "year": 2100,
                "director_id": 1,
                "actors_ids": [1],
                "facts": [{"fact": "string", "is_spoiler": True}],
                "rating": 10,
                "name": "string",
                "poster": "string",
                "english_name": "string",
                "alternative_name": "string",
                "description": "string",
                "type": "movie",
                "genres": ["string"],
                "countries": ["string"],
                "trailer": "string",
            },
            {
                "year": 2100,
                "director_id": 1,
                "actors_ids": [1],
                "facts": [{"is_spoiler": True}],
                "rating": 10,
                "name": "string",
                "poster": "http://example.com/poster.jpg",
                "english_name": "string",
                "alternative_name": "string",
                "description": "string",
                "type": "movie",
                "genres": ["string"],
                "countries": ["string"],
            },
        ]

        self.correct_film = {
            "year": 2100,
            "facts": [{"fact": "string", "is_spoiler": True}],
            "rating": 10,
            "name": "string",
            "english_name": "string",
            "alternative_name": "string",
            "description": "string",
            "type": "movie",
            "genres": ["string"],
            "countries": ["string"],
            "movie_length": 2147483647,
            "poster": "https://test.test.ru/",
        }
        self.film_nf = [
            {
                "year": 2100,
                "director_id": 94827398472397492739472937492384723948723,
                "actors_ids": [1],
                "facts": [{"fact": "string", "is_spoiler": True}],
                "rating": 10,
                "name": "string",
                "poster": "https://example.com/poster.jpg",
                "english_name": "string",
                "alternative_name": "string",
                "description": "string",
                "type": "movie",
                "genres": ["string"],
                "countries": ["string"],
            },
            {
                "year": 2100,
                "director_id": 1,
                "actors_ids": [0],
                "facts": [{"fact": "string", "is_spoiler": True}],
                "rating": 10,
                "name": "string",
                "poster": "https://example.com/poster.jpg",
                "english_name": "string",
                "alternative_name": "string",
                "description": "string",
                "type": "movie",
                "genres": ["string"],
                "countries": ["string"],
            },
        ]
        response = self.client.post(
            self.sign_up_url, data=self.correct_user_1, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = authenticate(**self.correct_user_1)
        access_token = str(RefreshToken.for_user(user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    def test_get_films(self):
        for query in self.query_params_movies:
            with self.subTest():
                response = self.client.get(f"/api/movies/{query}")
                self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_incorrect_films(self):
        for incorrect_film in self.incorrect_films:
            with self.subTest(incorrect_film=incorrect_film):
                response = self.client.post(
                    "/api/movies/", data=incorrect_film, format="json"
                )
                self.assertEqual(
                    response.status_code, status.HTTP_400_BAD_REQUEST
                )

    def test_404_create_film(self):
        for incorrect_film in self.film_nf:
            with self.subTest(incorrect_film=incorrect_film):
                response = self.client.post(
                    "/api/movies/", data=incorrect_film, format="json"
                )
                self.assertEqual(
                    response.status_code, status.HTTP_404_NOT_FOUND
                )

    def test_create_correct_film(self):
        with self.subTest():
            response = self.client.post(
                "/api/movies/", data=self.correct_film, format="json"
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_401_create_film(self):
        with self.subTest():
            self.client.credentials()
            response = self.client.post(
                "/api/movies/", data=self.correct_film, format="json"
            )
            self.assertEqual(
                response.status_code, status.HTTP_401_UNAUTHORIZED
            )

    def test_wrong_token(self):
        with self.subTest():
            self.client.credentials(HTTP_AUTHORIZATION="Bearer wrong_token")
            response = self.client.post(
                "/api/movies/", data=self.correct_film, format="json"
            )
            self.assertEqual(
                response.status_code, status.HTTP_401_UNAUTHORIZED
            )

    def test_get_film_404(self):
        with self.subTest():
            response = self.client.get(
                "/api/movies/0/",
            )
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_film_200(self):
        with self.subTest():
            response = self.client.get(
                f"/api/movies/{self.film.id}/",
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_film_404(self):
        with self.subTest():
            response = self.client.delete(
                "/api/movies/0/",
            )
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_film_403(self):
        with self.subTest():
            response = self.client.delete(
                f"/api/movies/{self.film.id}/",
            )
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_film_401(self):
        with self.subTest():
            self.client.credentials()
            response = self.client.delete(
                f"/api/movies/{self.film.id}/",
            )
            self.assertEqual(
                response.status_code, status.HTTP_401_UNAUTHORIZED
            )

    def test_get_actors_200(self):
        with self.subTest():
            response = self.client.get(
                "/api/movies/actors/",
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_one_actor_200(self):
        with self.subTest():
            response = self.client.get(
                f"/api/movies/actors/{self.actor.id}/",
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_one_actor_404(self):
        with self.subTest():
            response = self.client.get(
                "/api/movies/actors/0/",
            )
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_directors_200(self):
        with self.subTest():
            response = self.client.get(
                "/api/movies/directors/",
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_one_director_200(self):
        with self.subTest():
            response = self.client.get(
                f"/api/movies/directors/{self.director.id}/",
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_one_director_404(self):
        with self.subTest():
            response = self.client.get(
                "/api/movies/directors/0/",
            )
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_genres_200(self):
        with self.subTest():
            response = self.client.get(
                "/api/movies/genres/",
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)
