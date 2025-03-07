import { instance } from "@/api/api.interceptor"
import { EndpointsEnum } from "@/constants/api.constants"
import { IMovie, MoviesResponse } from "@/types/movie.types"

interface IFilterFields {
	director?: string
	list_of_actors?: string
	list_of_countries?: string
	list_of_genres?: string
	list_of_types?: string
	year_end?: number
	year_start?: number
}

class MoviesService {
	// Получение списка всех фильмов/поиск фильма по названию
	async get(params: {
		page?: number
		filmName?: string
		filters?: IFilterFields
	}) {
		const response = await instance.get<MoviesResponse>(
			EndpointsEnum.MOVIES.GET,
			{
				params: {
					page: params.page,
					search: params.filmName,
					...params.filters
				}
			}
		)

		return response.data
	}

	// Получение одного фильма по ID
	async getById(movieId: number) {
		const response = await instance.get<IMovie>(
			EndpointsEnum.MOVIES.GET_BY_ID + `${movieId}/`
		)

		return response
	}

	// Добавление фильма (локального)
	async addNew(newMovie: Omit<IMovie, "id">) {
		const response = await instance.post<IMovie>(
			EndpointsEnum.MOVIES.ADD,
			newMovie
		)

		return response
	}

	// Удаление фильма (локального)
	async remove(movieId: number) {
		const response = await instance.delete(
			EndpointsEnum.MOVIES.REMOVE + `${movieId}/`
		)

		return response
	}

	// Получить список жанров
	async getGenres() {
		const response = await instance.get<string[]>(EndpointsEnum.MOVIES.GENRES)

		return response.data
	}
}

export default new MoviesService()
