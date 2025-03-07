# API Documentation

This API provides endpoints for managing movies, actors, directors, genres, and user authentication. Below is a detailed guide on how to use the API.

## Base URL

All endpoints are relative to the base URL:

```
https://api.example.com
```

## Authentication

Authentication is done using JWT (JSON Web Tokens). To authenticate, you need to obtain a token by logging in or registering.

### Obtain Token

**Endpoint:** `POST /api/users/auth/login/`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "access": "your_access_token",
  "refresh": "your_refresh_token"
}
```

### Refresh Token

**Endpoint:** `POST /api/users/auth/token/refresh/`

**Request Body:**

```json
{
  "refresh": "your_refresh_token"
}
```

**Response:**

```json
{
  "access": "your_new_access_token"
}
```

### Verify Token

**Endpoint:** `POST /api/users/auth/token/verify/`

**Request Body:**

```json
{
  "token": "your_token"
}
```

**Response:**

```
200 OK
```

## Movies

### Get List of Movies

**Endpoint:** `GET /api/movies/`

**Query Parameters:**

- `director`: Filter by director's name.
- `list_of_actors`: Filter by list of actors.
- `list_of_countries`: Filter by list of countries.
- `list_of_genres`: Filter by list of genres.
- `page`: Page number for pagination.
- `search`: Search by movie title (case-insensitive).
- `year_end`: End year for filtering.
- `year_start`: Start year for filtering.

**Response:**

```json
{
  "count": 123,
  "next": "http://api.example.org/accounts/?page=4",
  "previous": "http://api.example.org/accounts/?page=2",
  "results": [
    {
      "id": 1,
      "name": "Movie Name",
      "poster": "http://example.com/poster.jpg",
      "rating": 8.5,
      "year": 2020,
      "genres": ["Action", "Adventure"],
      "director": {
        "id": 1,
        "name": "Director Name"
      },
      "actors": [
        {
          "id": 1,
          "name": "Actor Name"
        }
      ]
    }
  ]
}
```

### Create a Movie

**Endpoint:** `POST /api/movies/`

**Request Body:**

```json
{
  "name": "Movie Name",
  "poster": "http://example.com/poster.jpg",
  "rating": 8.5,
  "year": 2020,
  "genres": ["Action", "Adventure"],
  "director_id": 1,
  "actors_ids": [1, 2],
  "facts": [
    {
      "fact": "Interesting fact",
      "is_spoiler": false
    }
  ]
}
```

**Response:**

```json
{
  "id": 1,
  "name": "Movie Name",
  "poster": "http://example.com/poster.jpg",
  "rating": 8.5,
  "year": 2020,
  "genres": ["Action", "Adventure"],
  "director": {
    "id": 1,
    "name": "Director Name"
  },
  "actors": [
    {
      "id": 1,
      "name": "Actor Name"
    }
  ]
}
```

### Get Movie Details

**Endpoint:** `GET /api/movies/{id}/`

**Response:**

```json
{
  "id": 1,
  "name": "Movie Name",
  "poster": "http://example.com/poster.jpg",
  "rating": 8.5,
  "year": 2020,
  "genres": ["Action", "Adventure"],
  "director": {
    "id": 1,
    "name": "Director Name"
  },
  "actors": [
    {
      "id": 1,
      "name": "Actor Name"
    }
  ]
}
```

### Delete a Movie

**Endpoint:** `DELETE /api/movies/{id}/`

**Response:**

```
204 No Content
```

## Actors

### Get List of Actors

**Endpoint:** `GET /api/movies/actors/`

**Query Parameters:**

- `page`: Page number for pagination.
- `search`: Search by actor's name (case-insensitive).

**Response:**

```json
{
  "count": 123,
  "next": "http://api.example.org/accounts/?page=4",
  "previous": "http://api.example.org/accounts/?page=2",
  "results": [
    {
      "id": 1,
      "name": "Actor Name",
      "photo": "http://example.com/photo.jpg"
    }
  ]
}
```

### Get Actor Details

**Endpoint:** `GET /api/movies/actors/{actor_id}/`

**Response:**

```json
{
  "id": 1,
  "name": "Actor Name",
  "photo": "http://example.com/photo.jpg"
}
```

## Directors

### Get List of Directors

**Endpoint:** `GET /api/movies/directors/`

**Query Parameters:**

- `page`: Page number for pagination.
- `search`: Search by director's name (case-insensitive).

**Response:**

```json
{
  "count": 123,
  "next": "http://api.example.org/accounts/?page=4",
  "previous": "http://api.example.org/accounts/?page=2",
  "results": [
    {
      "id": 1,
      "name": "Director Name",
      "photo": "http://example.com/photo.jpg"
    }
  ]
}
```

### Get Director Details

**Endpoint:** `GET /api/movies/directors/{director_id}/`

**Response:**

```json
{
  "id": 1,
  "name": "Director Name",
  "photo": "http://example.com/photo.jpg"
}
```

## Genres

### Get List of Genres

**Endpoint:** `GET /api/movies/genres/`

**Response:**

```
200 OK
```

## Recommendations

### Get Similar Movies

**Endpoint:** `POST /api/recommend/ai/similiar/`

**Request Body:**

```json
{
  "film": "Movie Name"
}
```

**Response:**

```json
{
  "film": "Movie Name"
}
```

### Get Wishlist Recommendations

**Endpoint:** `POST /api/recommend/ai/wish/`

**Request Body:**

```json
{
  "wish": "I want to watch a comedy"
}
```

**Response:**

```json
{
  "wish": "I want to watch a comedy"
}
```

## Status

### Get API Status

**Endpoint:** `GET /api/status/`

**Response:**

```
200 OK
```

## Users

### Register a New User

**Endpoint:** `POST /api/users/auth/sign-up/`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "email": "user@example.com",
  "access": "your_access_token",
  "refresh": "your_refresh_token"
}
```

### Logout

**Endpoint:** `POST /api/users/auth/logout/`

**Response:**

```
200 OK
```

### Delete User

**Endpoint:** `DELETE /api/users/delete/`

**Response:**

```
204 No Content
```

## Security

- **jwtAuth**: JWT authentication is required for most endpoints. Use the `Authorization` header with the value `Bearer <your_access_token>`.

## Schemas

### Movie

```json
{
  "id": 1,
  "name": "Movie Name",
  "poster": "http://example.com/poster.jpg",
  "rating": 8.5,
  "year": 2020,
  "genres": ["Action", "Adventure"],
  "director": {
    "id": 1,
    "name": "Director Name"
  },
  "actors": [
    {
      "id": 1,
      "name": "Actor Name"
    }
  ]
}
```

### Actor

```json
{
  "id": 1,
  "name": "Actor Name",
  "photo": "http://example.com/photo.jpg"
}
```

### Director

```json
{
  "id": 1,
  "name": "Director Name",
  "photo": "http://example.com/photo.jpg"
}
```

### Token

```json
{
  "access": "your_access_token",
  "refresh": "your_refresh_token"
}
```

### User Registration

```json
{
  "email": "user@example.com",
  "access": "your_access_token",
  "refresh": "your_refresh_token"
}
```

## Conclusion

@made with ❤️ by developers 💋