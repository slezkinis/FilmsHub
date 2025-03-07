import { instance } from "@/api/api.interceptor"
import { EndpointsEnum } from "@/constants/api.constants"
import { MoviesResponse } from "@/types/movie.types"
import axios from "axios"

interface BookMarkStatus {
	type: "like" | "dislike" | "aside" | "viewed"
	worth_bookmark: boolean
}

class BookmarksService {
	async getLiked(page?: number) {
		const response = await instance.get<MoviesResponse>(
			EndpointsEnum.BOOKMARKS.GET_LIKED,
			{ params: { page } }
		)

		return response.data
	}

	async getAside(page?: number) {
		const response = await instance.get<MoviesResponse>(
			EndpointsEnum.BOOKMARKS.GET_ASIDE,
			{ params: { page } }
		)

		return response.data
	}

	async getViewed(page?: number) {
		const response = await instance.get<MoviesResponse>(
			EndpointsEnum.BOOKMARKS.GET_VIEWED,
			{ params: { page } }
		)

		return response.data
	}

	async getDisliked(page?: number) {
		const response = await instance.get<MoviesResponse>(
			EndpointsEnum.BOOKMARKS.GET_DISLIKED,
			{ params: { page } }
		)

		return response.data
	}

	async getCurrent(movieId: number) {
		const response = await instance.get<BookMarkStatus>(
			EndpointsEnum.BOOKMARKS.GET_STATUS(movieId)
		)

		return response.data
	}

	async setLike(movieId: number) {
		await instance.post(EndpointsEnum.BOOKMARKS.SET_LIKE(movieId))
	}

	async setAside(movieId: number) {
		await instance.post(EndpointsEnum.BOOKMARKS.SET_ASIDE(movieId))
	}

	async setViewed(movieId: number) {
		await instance.post(EndpointsEnum.BOOKMARKS.SET_VIEW(movieId))
	}

	async setDislike(movieId: number) {
		await instance.post(EndpointsEnum.BOOKMARKS.SET_DISLIKE(movieId))
	}

	async removeFromBookmarks(movieId: number) {
		await instance.delete(EndpointsEnum.BOOKMARKS.REMOVE(movieId))
	}
}

export default new BookmarksService()
