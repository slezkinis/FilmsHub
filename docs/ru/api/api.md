# Документация API

Этот документ предоставляет описание API для работы с фильмами, актерами, режиссерами, жанрами, а также для управления пользователями и их предпочтениями. API поддерживает аутентификацию через JWT (JSON Web Tokens) и предоставляет возможность поиска, фильтрации и рекомендаций фильмов.

## Основные разделы API

1. **Фильмы (Movies)**
2. **Актеры (Actors)**
3. **Режиссеры (Directors)**
4. **Жанры (Genres)**
5. **Рекомендации (Recommendations)**
6. **Пользователи (Users)**
7. **Статус (Status)**

---

## 1. Фильмы (Movies)

### Получить список фильмов
**GET** `/api/movies/`

- **Описание**: Получить список фильмов с возможностью поиска по названию, фильтрации по режиссеру, актерам, странам, жанрам и типу (например, фильм, сериал и т.д.).
- **Параметры**:
  - `director` (string): Фильтрация по режиссеру.
  - `list_of_actors` (string): Фильтрация по списку актеров.
  - `list_of_countries` (string): Фильтрация по списку стран.
  - `list_of_genres` (string): Фильтрация по списку жанров.
  - `list_of_types` (string): Фильтрация по типу (например, `movie`, `tv-series` и т.д.).
  - `page` (integer): Номер страницы для пагинации.
  - `search` (string): Поиск по названию фильма (регистронезависимый).
  - `year_start` (integer): Начало периода поиска по году.
  - `year_end` (integer): Конец периода поиска по году.
- **Ответ**: `200 OK` с объектом `PaginatedMovieList`.

### Добавить фильм
**POST** `/api/movies/`

- **Описание**: Добавить новый фильм.
- **Тело запроса**: Объект `MovieRequest`.
- **Ответ**: `201 Created` с объектом `Movie`.

### Получить фильм по ID
**GET** `/api/movies/{id}/`

- **Описание**: Получить информацию о фильме по его ID.
- **Параметры**:
  - `id` (integer): Уникальный идентификатор фильма.
- **Ответ**: `200 OK` с объектом `Movie`.

### Удалить фильм
**DELETE** `/api/movies/{id}/`

- **Описание**: Удалить фильм по его ID.
- **Параметры**:
  - `id` (integer): Уникальный идентификатор фильма.
- **Ответ**: `204 No Content`.

---

## 2. Актеры (Actors)

### Получить список актеров
**GET** `/api/movies/actors/`

- **Описание**: Получить список актеров с возможностью поиска по имени.
- **Параметры**:
  - `page` (integer): Номер страницы для пагинации.
  - `search` (string): Поиск по имени актера (регистронезависимый).
- **Ответ**: `200 OK` с объектом `PaginatedActorIdList`.

### Получить актера по ID
**GET** `/api/movies/actors/{actor_id}/`

- **Описание**: Получить информацию об актере по его ID.
- **Параметры**:
  - `actor_id` (integer): Уникальный идентификатор актера.
- **Ответ**: `200 OK` с объектом `ActorId`.

---

## 3. Режиссеры (Directors)

### Получить список режиссеров
**GET** `/api/movies/directors/`

- **Описание**: Получить список режиссеров с возможностью поиска по имени.
- **Параметры**:
  - `page` (integer): Номер страницы для пагинации.
  - `search` (string): Поиск по имени режиссера (регистронезависимый).
- **Ответ**: `200 OK` с объектом `PaginatedDirectorIdList`.

### Получить режиссера по ID
**GET** `/api/movies/directors/{director_id}/`

- **Описание**: Получить информацию о режиссере по его ID.
- **Параметры**:
  - `director_id` (integer): Уникальный идентификатор режиссера.
- **Ответ**: `200 OK` с объектом `DirectorId`.

---

## 4. Жанры (Genres)

### Получить список жанров
**GET** `/api/movies/genres/`

- **Описание**: Получить список всех жанров.
- **Ответ**: `200 OK`.

---

## 5. Рекомендации (Recommendations)

### Получить рекомендации по схожим фильмам
**POST** `/api/recommend/ai/similiar/`

- **Описание**: Получить рекомендации по фильмам, схожим с указанным.
- **Тело запроса**: Объект `SimiliarRequestRequest`.
- **Ответ**: `201 Created` с объектом `SimiliarRequest`.

### Получить рекомендации по желанию
**POST** `/api/recommend/ai/wish/`

- **Описание**: Получить рекомендации на основе пожеланий пользователя.
- **Тело запроса**: Объект `SimiliarRequestRequest`.
- **Ответ**: `201 Created` с объектом `WishRequest`.

### Получить стандартные рекомендации
**GET** `/api/recommend/default/`

- **Описание**: Получить стандартные рекомендации фильмов.
- **Параметры**:
  - `page` (integer): Номер страницы для пагинации.
  - `page_size` (integer): Количество результатов на странице.
- **Ответ**: `200 OK` с объектом `PaginatedMovieList`.

---

## 6. Пользователи (Users)

### Вход в систему
**POST** `/api/users/auth/login/`

- **Описание**: Вход в систему с использованием email и пароля. Возвращает access и refresh токены.
- **Тело запроса**: Объект `TokenObtainPairRequest`.
- **Ответ**: `200 OK` с объектом `TokenObtainPair`.

### Выход из системы
**POST** `/api/users/auth/logout/`

- **Описание**: Выход из системы. Требуется refresh токен.
- **Тело запроса**: Объект `LogoutRequest`.
- **Ответ**: `204 No Content`.

### Регистрация пользователя
**POST** `/api/users/auth/sign-up/`

- **Описание**: Регистрация нового пользователя.
- **Тело запроса**: Объект `UserRegistrationRequest`.
- **Ответ**: `201 Created` с объектом `UserRegistration`.

### Обновление access токена
**POST** `/api/users/auth/token/refresh/`

- **Описание**: Обновление access токена с использованием refresh токена.
- **Тело запроса**: Объект `TokenRefreshRequest`.
- **Ответ**: `200 OK` с объектом `TokenRefresh`.

### Проверка токена
**POST** `/api/users/auth/token/verify/`

- **Описание**: Проверка валидности токена.
- **Тело запроса**: Объект `TokenVerifyRequest`.
- **Ответ**: `200 OK`.

### Удаление пользователя
**DELETE** `/api/users/delete/`

- **Описание**: Удаление текущего пользователя.
- **Ответ**: `204 No Content`.

### Управление закладками пользователя
- **Добавить фильм в закладки**: `POST /api/users/movies/{movie_id}/bookmarks/aside/`
- **Получить текущий тип закладки**: `GET /api/users/movies/{movie_id}/bookmarks/current/`
- **Удалить фильм из закладок**: `DELETE /api/users/movies/{movie_id}/bookmarks/delete/`
- **Добавить дизлайк**: `POST /api/users/movies/{movie_id}/bookmarks/dislike/`
- **Добавить лайк**: `POST /api/users/movies/{movie_id}/bookmarks/like/`
- **Добавить просмотренный фильм**: `POST /api/users/movies/{movie_id}/bookmarks/view/`

### Получить фильмы пользователя
- **Получить фильмы для пересмотра**: `GET /api/users/movies/aside/`
- **Получить дизлайки**: `GET /api/users/movies/disliked/`
- **Получить лайки**: `GET /api/users/movies/liked/`
- **Получить просмотренные фильмы**: `GET /api/users/movies/viewed/`

---

## 7. Статус (Status)

### Получить статус системы
**GET** `/api/status/`

- **Описание**: Получить статус системы.
- **Ответ**: `200 OK`.

---

## Аутентификация

API использует JWT (JSON Web Tokens) для аутентификации. Для доступа к защищенным методам необходимо передавать токен в заголовке `Authorization` в формате:

```
Authorization: Bearer <access_token>
```

---

## Примеры запросов

### Получить список фильмов
```bash
curl -X GET "http://api.example.org/api/movies/?search=Inception&year_start=2010&year_end=2020" -H "Authorization: Bearer <access_token>"
```

### Добавить фильм
```bash
curl -X POST "http://api.example.org/api/movies/" -H "Authorization: Bearer <access_token>" -H "Content-Type: application/json" -d '{
  "name": "Inception",
  "poster": "http://example.com/poster.jpg",
  "rating": 8.8,
  "type": "movie",
  "genres": ["Action", "Sci-Fi"],
  "year": 2010,
  "director_id": 1,
  "actors_ids": [1, 2, 3]
}'
```

### Вход в систему
```bash
curl -X POST "http://api.example.org/api/users/auth/login/" -H "Content-Type: application/json" -d '{
  "email": "user@example.com",
  "password": "password123"
}'
```

---

## Схемы данных

Описание всех схем данных, используемых в API, можно найти в разделе `components/schemas` в [OpenAPI спецификации](schema.yaml) .


---