from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
    OpenApiExample,
)
from films import serializers

validation_error_response = OpenApiResponse(
    description="Ошибка валидации, в ответе ошибки по конкретным полям "
    "и ошибки не связанные с конкретными полями",
    response={
        "type": "object",
        "properties": {
            "field_name1": {
                "type": "array",
                "items": {"type": "string", "example": "Ошибка валидации 1"},
            },
            "field_name2": {
                "type": "array",
                "items": {"type": "string", "example": "Ошибка валидации 3"},
            },
            "non_field_errors": {
                "type": "array",
                "items": {
                    "type": "string",
                    "example": "Ошибки не связанные с конкретным полем",
                },
            },
        },
        "example": {
            "field_name1": ["Ошибка валидации 1", "Ошибка валидации 2"],
            "field_name2": ["Ошибка валидации 3"],
            "non_field_errors": ["Ошибки не связанные с конкретным полем"],
        },
    },
)

auth_not_passed_response = OpenApiResponse(
    description="Авторизация не пройдена, либо токен "
    "не был передан, либо он истек, либо он некорректный",
    response={
        "example": {
            "detail": "Given token not valid for any token type",
            "code": "token_not_valid",
            "messages": [
                {
                    "token_class": "AccessToken",
                    "token_type": "access",
                    "message": "Token is invalid",
                }
            ],
        }
    },
    examples=[
        OpenApiExample(
            name="Токен не передан",
            value={"detail": "Учетные данные не были предоставлены."},
        ),
        OpenApiExample(
            name="Токен невалиден",
            value={
                "detail": "Given token not valid for any token type",
                "code": "token_not_valid",
                "messages": [
                    {
                        "token_class": "AccessToken",
                        "token_type": "access",
                        "message": "Token is invalid",
                    }
                ],
            },
        ),
    ],
)

films_list_docs = extend_schema(
    description="Получить список фильмов. Поддерживает "
    "поиск по названию и фильтрацию. Возвращает "
    "в том числе локальные фильмы (созданные пользователем), фильмы "
    "отсортированы по рейтингу по убыванию.",
    parameters=[
        OpenApiParameter(
            name="search",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Поиск по названию фильма (регистронезависимый)",
            required=False,
        ),
        OpenApiParameter(
            name="year_start",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Начало периода поиска по году",
            required=False,
        ),
        OpenApiParameter(
            name="year_end",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Конец периода поиска по году",
            required=False,
        ),
        OpenApiParameter(
            name="list_of_actors",
            location=OpenApiParameter.QUERY,
            description="Список актеров",
            type=str,
            required=False,
        ),
        OpenApiParameter(
            name="director",
            location=OpenApiParameter.QUERY,
            description="Режиссер",
            type=str,
            required=False,
        ),
        OpenApiParameter(
            name="list_of_genres",
            location=OpenApiParameter.QUERY,
            description="Список жанров",
            type=str,
            required=False,
        ),
        OpenApiParameter(
            name="list_of_countries",
            location=OpenApiParameter.QUERY,
            description="Список стран",
            type=str,
            required=False,
        ),
        OpenApiParameter(
            name="list_of_types",
            location=OpenApiParameter.QUERY,
            description="Список типов (tv-series, movie и т.д.)",
            type=str,
            required=False,
        ),
    ],
    responses={
        200: serializers.MovieSerializer,
        400: OpenApiResponse(
            description="Ошибка валидации в query параметрах"
        ),
    },
)

films_create_docs = extend_schema(
    description="Добавить фильм, фильм создается только "
    "для данного пользователя, остальным он недоступен (local=True)",
    request=serializers.MovieSerializer,
    examples=[
        OpenApiExample(
            name="Добавление локального фильма",
            value={
                "year": 2025,
                "facts": [
                    {
                        "fact": "Факт 1",
                        "is_spoiler": False
                    },
                    {
                        "fact": "Факт 2 со сполером. (PROOOD)",
                        "is_spoiler": True
                    }
                ],
                "rating": 9.999,
                "name": "Олимпиада PROOOOD",
                "poster": "https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cH"
                        + "M6Ly9jZG4udGJhbmsucnUvc3RhdGljL3BhZ2VzL2ZpbGVzL2V"
                        + "kMGE4YTUzLWU4NGMtNGYzNy05YTNlLTRkOTRkMGU4NDh"
                        + "mYi5wbmc=",
                "english_name": "PROOOOD",
                "description": "Состязание с практикой",
                "director_id": 1,
                "type": "movie",
                "genres": [
                    "драма"
                ],
                "countries": [
                    "Россия"
                ],
                "actors_ids": [
                    1,
                    2
                ],
                "trailer": None,
                "movie_length": 142
            },
            request_only=True,
        ),
    ],
    responses={
        201: serializers.MovieSerializer,
        400: validation_error_response,
        401: auth_not_passed_response,
        404: OpenApiResponse(
            description="Переданные" " актеры или режиссер не существуют"
        ),
    },
)

films_retrieve_docs = extend_schema(
    description="Получить фильм по id, можно получить"
    " как локальные (только свои) так и общие",
    responses={
        200: serializers.MovieSerializer,
        401: auth_not_passed_response,
    },
)

films_destroy_docs = extend_schema(
    description="Удалить фильм, удалить можно только свои локальные фильмы",
    responses={
        204: None,
        403: OpenApiResponse(description="Нет прав для удаления"),
        401: auth_not_passed_response,
        404: OpenApiResponse(description="Такого фильма не существует"),
    },
)

actor_list_docs = extend_schema(
    description="Получить список актеров c поиском",
    parameters=[
        OpenApiParameter(
            name="search",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Поиск по имени (регистронезависимый)",
            required=False,
        ),
    ],
)

actor_retrieve_docs = extend_schema(
    description="Получить актера",
    responses={
        200: serializers.ActorIdSerializer,
        404: OpenApiResponse(description="Такого актера не существует"),
    },
)

director_list_docs = extend_schema(
    description="Получить список режиссеров c поиском",
    parameters=[
        OpenApiParameter(
            name="search",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Поиск по имени (регистронезависимый)",
            required=False,
        ),
    ],
)

director_retrieve_docs = extend_schema(
    description="Получить режиссера",
    responses={
        200: serializers.DirectorIdSerializer,
        404: OpenApiResponse(description="Такого режиссера не существует"),
    },
)

genres_list_docs = extend_schema(
    description="Получить список жанров",
    responses={
        200: OpenApiResponse(
            response={"example": ["комедия", "романтика", "боевик"]}
        )
    },
)
