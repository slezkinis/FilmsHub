import { instance } from "@/api/api.interceptor"
import { EndpointsEnum } from "@/constants/api.constants"
import TokensService from "../auth/tokens.service"

class UserService {
	async logout() {
		const refresh = TokensService.getRefreshToken()

		await instance.post(EndpointsEnum.LOGOUT, { refresh })

		TokensService.clearTokens()
	}
}

export default new UserService()
