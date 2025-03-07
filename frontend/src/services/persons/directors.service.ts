import { instance } from "@/api/api.interceptor"
import { EndpointsEnum } from "@/constants/api.constants"
import { IPerson } from "@/types/person.types"

class DirectorsService {
	// Получение списка всех режиссёров/поиск режиссёра по имени
	async get(page?: number, directorName?: string) {
		const response = await instance.get<IPerson>(EndpointsEnum.ACTORS.GET, {
			params: { page, search: directorName }
		})

		return response
	}

	// Получение одного режиссёра по ID
	async getById(directorId: number) {
		const response = await instance.get<IPerson>(
			EndpointsEnum.ACTORS.GET_BY_ID + `${directorId}/`
		)

		return response
	}
}

export default new DirectorsService()
