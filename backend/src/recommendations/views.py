import os
import json

import requests
import logging

from django.db.models import FloatField, Value, Count, F, Case, When, Q
from django.db.models.functions import Coalesce, Abs
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from drf_spectacular.utils import extend_schema, OpenApiResponse

from films.extends_docs import auth_not_passed_response
from films.serializers import MovieSerializer
from films.models import Film
from recommendations.serializers import (
    SimiliarRequestSerializer,
    WishRequestSerializer,
)
from recommendations.models import AiRecHistory
from core.pagination import CustomPagePagination

logger = logging.getLogger(__name__)


@extend_schema(
    description="Получить рекомендованные фильмы на"
    " основе текущих лайков, дизлайков и "
    "других букмарков, основная ручка для рекомендаций",
    responses={200: MovieSerializer, 401: auth_not_passed_response},
)
class RecommendedFilmsView(ListAPIView):
    serializer_class = MovieSerializer
    pagination_class = CustomPagePagination

    def get_queryset(self):
        user = self.request.user

        liked_films = Film.objects.filter(
            bookmark__type="like", bookmark__user=user
        )
        disliked_films = Film.objects.filter(
            bookmark__type="dislike", bookmark__user=user
        )
        viewed_films = Film.objects.filter(
            bookmark__type="viewed", bookmark__user=user
        )
        aside_films = Film.objects.filter(
            bookmark__type="aside", bookmark__user=user
        )

        all_films = Film.objects.exclude(
            id__in=liked_films | disliked_films | viewed_films | aside_films
        )

        films_with_scores = all_films.annotate(
            score=Coalesce(
                self.calculate_film_score_annotation(
                    liked_films, disliked_films, viewed_films, aside_films
                ),
                Value(0.0, output_field=FloatField()),
            )
        ).order_by("-score")

        return films_with_scores

    def calculate_film_score_annotation(
        self, liked_films, disliked_films, viewed_films, aside_films
    ):
        score = Value(0.0, output_field=FloatField())

        score += self.calculate_bookmark_score_annotation(liked_films)
        score -= self.calculate_bookmark_score_annotation(disliked_films)
        score -= self.calculate_bookmark_score_annotation(viewed_films)
        score += self.calculate_bookmark_score_annotation(aside_films)

        score += F("rating") * Value(0.1, output_field=FloatField())
        return score

    def calculate_bookmark_score_annotation(
        self,
        bookmarked_films,
        genre_weight=0.4,
        actor_weight=0.3,
        year_weight=0.2,
        country_weight=0.1,
    ):
        score = Value(0.0, output_field=FloatField())

        for bookmarked_film in bookmarked_films:
            genre_match = Count(
                "genres",
                filter=Q(genres__overlap=bookmarked_film.genres),
                output_field=FloatField(),
            ) / Value(
                max(len(bookmarked_film.genres), 1), output_field=FloatField()
            )

            actor_match = Count(
                "actors",
                filter=Q(actors__in=bookmarked_film.actors.all()),
                output_field=FloatField(),
            ) / Value(
                max(len(bookmarked_film.actors.all()), 1),
                output_field=FloatField(),
            )

            year_match = Case(
                When(
                    year__lt=bookmarked_film.year - 10,
                    then=Value(0.0, output_field=FloatField()),
                ),
                When(
                    year__gt=bookmarked_film.year + 10,
                    then=Value(0.0, output_field=FloatField()),
                ),
                default=Value(1.0, output_field=FloatField())
                - (
                    Abs(
                        F("year")
                        - Value(
                            bookmarked_film.year, output_field=FloatField()
                        )
                    )
                    / Value(10.0, output_field=FloatField())
                ),
                output_field=FloatField(),
            )

            country_match = Count(
                "countries",
                filter=Q(countries__overlap=bookmarked_film.countries),
                output_field=FloatField(),
            ) / Value(
                max(len(bookmarked_film.countries), 1),
                output_field=FloatField(),
            )

            score += (
                genre_match * Value(genre_weight, output_field=FloatField())
                + actor_match * Value(actor_weight, output_field=FloatField())
                + year_match * Value(year_weight, output_field=FloatField())
                + country_match
                * Value(country_weight, output_field=FloatField())
            )

        return score


@extend_schema(
    description="Получить рекомендации по схожим фильмам с помощью AI",
    request=SimiliarRequestSerializer,
    responses={
        200: OpenApiResponse(response={"example": {"result": "ai_response"}}),
        401: auth_not_passed_response,
        400: OpenApiResponse(
            description="Ошибка от " "нейронки (неправильные данные)"
        ),
    },
)
class SimiliarView(CreateAPIView):
    serializer_class = SimiliarRequestSerializer
    parser_classes = [JSONParser]

    def create(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")
        logger.info(f"Content-Type: {request.content_type}")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        title = serializer.validated_data["film"]

        cfg = {
            "url": os.getenv("TOGETHER_URL"),
            "api_key": os.getenv("TOGETHER_API"),
        }

        prompt = f"film: {title}"

        request_body = {
            "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
            "messages": [
                {
                    "role": "system",
                    "content": "Ты хороший друг и советчик. У тебя очень"
                    " хороший вкус в киноиндустрии, фильмах "
                    "и прочем. Ты всегда выбираешь хорошие "
                    "фильмы. Твоя задача посоветовать фильм "
                    "похожий на указанный, фильм указывается"
                    " под тегом film:. Очень важно чтобы ты "
                    "верно подобрал фильм похожий на указанный."
                    " От точности твоего ответа зависит жизнь"
                    " человека. В ответ ожиданется не больше"
                    " трёх фильмов с кратким описанием и"
                    " интересным фактом.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        }

        headers = {
            "Authorization": f"Bearer {cfg['api_key']}",
            "Content-Type": "application/json",
        }

        try:
            response = requests.post(
                cfg["url"], headers=headers, json=request_body
            )
            response.raise_for_status()

            response_data = response.json()
            content = (
                response_data.get("choices", [{}])[0]
                .get("message", {})
                .get("content")
            )
            total_tokens = response_data.get("usage", {}).get("total_tokens")

            if not content:
                return Response(
                    {"error": "AI service unavailable"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            AiRecHistory.objects.create(
                user=(request.user if request.user.is_authenticated else None),
                response=content,
                request=json.dumps(request_body),
                total_tokens=total_tokens,
            )

            return Response({"result": content}, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"Request to external API failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": f"Internal server error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(
    description="Получить рекомендации по желанию от AI",
    request=WishRequestSerializer,
    responses={
        200: OpenApiResponse(response={"example": {"result": "ai_response"}}),
        401: auth_not_passed_response,
        400: OpenApiResponse(
            description="Ошибка от " "нейронки (неправильные данные)"
        ),
    },
)
class WishView(CreateAPIView):
    serializer_class = WishRequestSerializer
    parser_classes = [JSONParser]

    def create(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")
        logger.info(f"Content-Type: {request.content_type}")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        title = serializer.validated_data["wish"]

        cfg = {
            "url": os.getenv("TOGETHER_URL"),
            "api_key": os.getenv("TOGETHER_API"),
        }

        prompt = f"wish: {title}"

        request_body = {
            "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
            "messages": [
                {
                    "role": "system",
                    "content": "Ты хороший друг и советчик. У тебя очень"
                    " хороший вкус в киноиндустрии, фильмах и"
                    " прочем. Ты всегда выбираешь хорошие"
                    " фильмы. Твоя задача посоветовать фильм "
                    "по указанным желаниям, желания будут"
                    " указанны как 'wish:'. Очень важно чтобы "
                    "ты верно подобрал фильм подходящий по "
                    "критериям. От точности твоего ответа "
                    "зависит жизнь человека. В ответ ожидается"
                    " не больше трёх фильмов с кратким описанием "
                    "и интересным фактом. Форматируй выходной "
                    "результат как plain text. Не используй"
                    " markdown. Пиши как просто файл .txt",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        }

        headers = {
            "Authorization": f"Bearer {cfg['api_key']}",
            "Content-Type": "application/json",
        }

        try:
            response = requests.post(
                cfg["url"], headers=headers, json=request_body
            )
            response.raise_for_status()

            response_data = response.json()
            content = (
                response_data.get("choices", [{}])[0]
                .get("message", {})
                .get("content")
            )
            total_tokens = response_data.get("usage", {}).get("total_tokens")

            if not content:
                return Response(
                    {"error": "AI service unavailable"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            AiRecHistory.objects.create(
                user=(request.user if request.user.is_authenticated else None),
                response=content,
                request=json.dumps(request_body),
                total_tokens=total_tokens,
            )

            return Response({"result": content}, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"Request to external API failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": f"Internal server error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
