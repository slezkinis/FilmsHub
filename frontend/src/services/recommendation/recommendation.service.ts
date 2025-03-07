import { instance } from "@/api/api.interceptor"
import { EndpointsEnum } from "@/constants/api.constants"
import { MoviesResponse } from "@/types/movie.types"

class RecommendationService {
	async get(params?: { page_size?: number; page?: number }) {
		const response = await instance.get<MoviesResponse>(
			EndpointsEnum.RECOMMENDATIONS.DEFAULT,
			{ params }
		)

		return response.data
	}

	async wish(text: string) {
		const response = await instance.post<{ result: string }>(
			EndpointsEnum.RECOMMENDATIONS.AI_WISH,
			{
				wish: text
			}
		)

		return response.data
	}

	async similar(text: string) {
		const response = await instance.post<{ result: string }>(
			EndpointsEnum.RECOMMENDATIONS.AI_SIMILAR,
			{
				film: text
			}
		)

		return response.data
	}
}

export default new RecommendationService()
