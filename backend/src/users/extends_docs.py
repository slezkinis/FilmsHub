# users/docs.py

from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
    OpenApiExample,
)
from users.serializers import (
    UserRegistrationSerializer,
    CurrentBookmarkSerializer,
    LogoutSerializer,
    LoginSerializer,
)
from films.serializers import MovieSerializer
from films.extends_docs import (
    validation_error_response,
    auth_not_passed_response,
)

user_registration_schema = extend_schema(
    description="Регистрация пользователя",
    request=UserRegistrationSerializer,
    responses={
        201: UserRegistrationSerializer,
        400: validation_error_response,
        409: OpenApiResponse(
            description="Пользователь с таким email уже существует"
        ),
    },
    examples=[
        OpenApiExample(
            "Пример регистрации",
            value={
                "email": "test_user@example.com",
                "password": "very_hard_password",
            },
            request_only=True,
        ),
    ]
)

login_schema = extend_schema(
    description="Авторизация по JWT",
    request=LoginSerializer,
    responses={
        400: validation_error_response,
        401: OpenApiResponse(description="Пароль или почта неправильные"),
    },
    examples=[
        OpenApiExample(
            "Пример авторизации",
            value={
                "email": "test_user@example.com",
                "password": "very_hard_password",
            },
            request_only=True,
        ),
    ]
)

bookmark_destroy_schema = extend_schema(
    description="Удалить букмарку с фильма "
    "(удаляет любой тип букмарки с фильма)",
    responses={
        204: None,
        401: auth_not_passed_response,
        404: OpenApiResponse(description="Такого фильма не существует"),
    },
)

current_bookmark_schema = extend_schema(
    description="Получить текущий тип букмарки на фильме, "
    "если пользователь не ставил "
    "букмарку на этот фильм то в type будет null, a worth_bookmark будет True",
    responses={
        200: CurrentBookmarkSerializer,
        401: auth_not_passed_response,
        404: OpenApiResponse(description="Такого фильма не существует"),
    },
)

like_create_schema = extend_schema(
    description="Добавить в лайкнутые, перезаписывает"
    " текущую букмарку для этого фильма",
    responses={
        201: OpenApiResponse(
            description="Лайк успешно поставлен (букмарка создана)"
        ),
        401: auth_not_passed_response,
        404: OpenApiResponse(description="Такого фильма не существует"),
    },
)

dislike_create_schema = extend_schema(
    description="Добавить в дизлайкнутые,"
    " перезаписывает текущую букмарку для этого фильма",
    responses={
        201: OpenApiResponse(
            description="Дизлайк успешно поставлен (букмарка создана)"
        ),
        401: auth_not_passed_response,
        404: OpenApiResponse(description="Такого фильма не существует"),
    },
)

viewed_create_schema = extend_schema(
    description="Добавить в просмотренное (фильмы "
    "которые пользователь уже смотрел и не хочет пересматривать),"
    " перезаписывает текущую букмарку для этого фильма",
    responses={
        201: OpenApiResponse(
            description="Фильм добавлен в те которые "
            "пользователь уже смотрел (букмарка создана)"
        ),
        401: auth_not_passed_response,
        404: OpenApiResponse(description="Такого фильма не существует"),
    },
)

aside_create_schema = extend_schema(
    description="Добавить в пересматриваемые",
    responses={
        201: OpenApiResponse(
            description="Фильм добавлен в те которые"
            " пользователь хочет пересмотреть (букмарка создана)"
        ),
        401: auth_not_passed_response,
        404: OpenApiResponse(description="Такого фильма не существует"),
    },
)

like_list_schema = extend_schema(
    description="Получить лайкнутые фильмы",
    responses={200: MovieSerializer, 401: auth_not_passed_response},
)

dislike_list_schema = extend_schema(
    description="Получить дизлайкнутые фильмы",
    responses={
        200: MovieSerializer,
        401: auth_not_passed_response,
    },
)

viewed_list_schema = extend_schema(
    description="Получить просмотренные фильмы",
    responses={
        200: MovieSerializer,
        401: auth_not_passed_response,
    },
)

aside_list_schema = extend_schema(
    description="Получить фильмы которые пользователь хочет пересмотреть",
    responses={200: MovieSerializer, 401: auth_not_passed_response},
)

logout_schema = extend_schema(
    description="Выход из аккаунта",
    request=LogoutSerializer,
    responses={
        204: OpenApiResponse(
            description="Выход успешный, токен добавлен в black list"
        ),
        401: auth_not_passed_response,
    },
    examples=[
        OpenApiExample(
            "Пример выхода",
            value={"refresh": "eyJhbGciO.token"},
            request_only=True,
        ),
    ],
)

delete_user_schema = extend_schema(
    description="Удалить пользователя",
    responses={
        204: OpenApiResponse(description="Аккаунт успешно удален"),
        401: auth_not_passed_response,
    },
)

movie_local_schema = extend_schema(
    description="Получить локальные фильмы пользователя (local=True)",
    responses={
        200: MovieSerializer,
        401: auth_not_passed_response,
    },
)
