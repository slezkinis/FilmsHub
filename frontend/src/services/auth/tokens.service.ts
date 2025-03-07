import { STORAGE_KEYS } from "@/constants/api.constants"
import Cookies from "js-cookie"

class TokensService {
	// Получение access токена
	getAccessToken(): string | undefined {
		return Cookies.get(STORAGE_KEYS.ACCESS_TOKEN)
	}

	// Получение refresh токена
	getRefreshToken(): string | undefined {
		return Cookies.get(STORAGE_KEYS.REFRESH_TOKEN)
	}

	// Сохранение новой пары токенов
	setTokens(accessTokens: string, refreshToken: string): void {
		Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, accessTokens)
		Cookies.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
	}

	// Очистка всех токенов
	clearTokens(): void {
		Cookies.remove(STORAGE_KEYS.REFRESH_TOKEN)
		Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN)
	}
}

export default new TokensService()

