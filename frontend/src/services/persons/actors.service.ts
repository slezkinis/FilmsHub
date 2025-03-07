import { instance } from "@/api/api.interceptor"
import { EndpointsEnum } from "@/constants/api.constants"
import { IPerson, IPersonRequest } from "@/types/person.types"

class ActorsService {
	// Получение списка всех актёров/поиск актёра по имени
	async get(page?: number, actorName?: string) {
		const response = await instance.get<IPersonRequest>(
			EndpointsEnum.ACTORS.GET,
			{
				params: { page, search: actorName }
			}
		)

		return response
	}

	// Получение одного актёра по ID
	async getById(actorId: number) {
		const response = await instance.get<IPerson>(
			EndpointsEnum.ACTORS.GET_BY_ID + `${actorId}/`
		)

		return response
	}
}

export default new ActorsService()
