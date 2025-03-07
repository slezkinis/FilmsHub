import axios from "axios"

import { getContentType } from "@/api/api.helper"
import { instance } from "@/api/api.interceptor"
import { EndpointsEnum, SERVER_URL } from "@/constants/api.constants"
import {
	AuthResponseType,
	IAuthError,
	ITokensPair,
	IUserLogin
} from "@/types/auth.types"
import TokensService from "./tokens.service"

class AuthService {
	// Авторизация
	async signIn(data: IUserLogin): Promise<AuthResponseType<ITokensPair>> {
		try {
			const response = await instance<ITokensPair>({
				url: EndpointsEnum.AUTH.LOGIN,
				method: "POST",
				data
			})

			return response
		} catch (error) {
			return this.handleError(error)
		}
	}

	// Регистрация
	async signUp(data: IUserLogin): Promise<AuthResponseType<ITokensPair>> {
		try {
			const response = await instance<ITokensPair>({
				url: EndpointsEnum.AUTH.REGISTER,
				method: "POST",
				data
			})

			return response
		} catch (error) {
			return this.handleError(error)
		}
	}

	// Проверка токенов
	async verifyToken(accessToken: string): Promise<boolean> {
		if (accessToken) {
			try {
				const response = await axios.post(
					SERVER_URL + EndpointsEnum.AUTH.VERIFY,
					{ token: accessToken },
					{
						headers: getContentType()
					}
				)

				if (response.status === 200) {
					return true
				} else {
					TokensService.clearTokens()
					return false
				}
			} catch (error) {
				TokensService.clearTokens()
				return false
			}
		}

		TokensService.clearTokens()
		return false
	}

	// Получение новой пары токенов
	async getNewTokens(): Promise<void> {
		const refreshToken = TokensService.getRefreshToken()

		const response = await axios.post<string, { data: ITokensPair }>(
			SERVER_URL + EndpointsEnum.AUTH.GET_NEW_TOKENS,
			{
				refresh: refreshToken
			},
			{
				headers: getContentType()
			}
		)

		if (response.data.access)
			TokensService.setTokens(response.data.access, response.data.refresh)
	}

	private handleError(error: unknown): IAuthError {
		if (axios.isAxiosError(error)) {
			if (error.response && typeof error.response.data === "object") {
				return {
					message:
						typeof error.response.data[Object.keys(error.response.data)[0]] ===
						"string"
							? error.response.data[Object.keys(error.response.data)[0]]
							: error.response.data[Object.keys(error.response.data)[0]][0],
					status: error.response.status || 500
				}
			}
		}

		return { message: "Ошибка на сервере", status: 500 }
	}
}

export default new AuthService()
