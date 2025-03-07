import axios from "axios"

import { SERVER_URL } from "@/constants/api.constants"
import AuthService from "@/services/auth/auth.service"
import TokensService from "@/services/auth/tokens.service"
import { errorCatch, getContentType } from "./api.helper"

// Образ axios с нужными настройками
export const instance = axios.create({
	baseURL: SERVER_URL,
	headers: getContentType()
})

// Запрос
instance.interceptors.request.use(config => {
	const accessToken = TokensService.getAccessToken()

	if (config.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

// Ответ
instance.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config

		if (
			(error.response.status === 401 ||
				errorCatch(error) === "jwt expired" ||
				errorCatch(error) === "jwt must be provided") &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true

			try {
				// Получение нового токена
				await AuthService.getNewTokens()
				return instance.request(originalRequest)
			} catch (error) {
				// Очистка токена
				if (errorCatch(error) === "jwt expired") TokensService.clearTokens()
			}
		}

		// throw error
		return Promise.reject(error)
	}
)

