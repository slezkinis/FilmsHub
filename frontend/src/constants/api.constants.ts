export const SERVER_URL =
	process.env.SERVER_URL ||
	"https://prod-team-42-p2j2ueen.final.prodcontest.ru/api"

export const enum STORAGE_KEYS {
	ACCESS_TOKEN = "access-token",
	REFRESH_TOKEN = "refresh-token"
}

export const EndpointsEnum = {
	AUTH: {
		GET_NEW_TOKENS: "/users/auth/token/refresh/", // [POST]
		REGISTER: "/users/auth/sign-up/", // [POST]
		LOGIN: "/users/auth/login/", // [POST]
		VERIFY: "/users/auth/token/verify/" // [POST]
	},
	MOVIES: {
		GET: "/movies/", // ?page=${number}&search=${название} [GET]
		ADD: "/movies/", // [POST]
		GET_BY_ID: "/movies/", // + movieId [GET]
		REMOVE: "/movies/", // + movieId [DELETE],
		GENRES: "/movies/genres/" // Жанры [GET]
	},
	ACTORS: {
		GET: "/movies/actors/", // ?page=${number}&search=${имя актёра} [GET]
		GET_BY_ID: "/movies/actors/" // + actorId [GET]
	},
	DIRECTORS: {
		GET: "/movies/directors/", // ?page=${number}&search=${имя режисёр} [GET]
		GET_BY_ID: "/movies/directors/" // + directorId [GET]
	},
	BOOKMARKS: {
		GET_STATUS: (movieId: number) =>
			`/users/movies/${movieId}/bookmarks/current/`,
		GET_LIKED: "/users/movies/liked/", // ?page=${number} Хочет посмотреть [GET]
		GET_ASIDE: "/users/movies/aside/", // ?page=${number} Будет пересматривать [GET]
		GET_VIEWED: "/users/movies/viewed/", // ?page=${number} Просмотрено и больше не интересно [GET]
		GET_DISLIKED: "/users/movies/disliked/", // ?page=${number} Не интересно [Get]
		GET_USER_MOVIES: "/users/movies/", // ?page=${number} Список фильмов, добавленных пользователем [GET]
		SET_LIKE: (movieId: number) => `/users/movies/${movieId}/bookmarks/like/`, // [POST]
		SET_ASIDE: (movieId: number) => `/users/movies/${movieId}/bookmarks/aside/`, // [POST]
		SET_VIEW: (movieId: number) => `/users/movies/${movieId}/bookmarks/view/`, // [POST]
		SET_DISLIKE: (movieId: number) =>
			`/users/movies/${movieId}/bookmarks/dislike/`, // [POST]
		REMOVE: (movieId: number) => `/users/movies/${movieId}/bookmarks/delete/` // [DELETE]
	},
	RECOMMENDATIONS: {
		AI_WISH: "/recommend/ai/wish/",
		AI_SIMILAR: "/recommend/ai/similiar/",
		DEFAULT: "/recommend/default/" // ?page=${number}&page_size=${number} [GET]
	},
	LOGOUT: "/users/auth/logout/",
	TEST: {
		GET_STATUS: "/status" // [GET]
	}
} as const
