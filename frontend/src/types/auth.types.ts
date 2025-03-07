import type { AxiosResponse } from "axios"

export interface ITokensPair {
	access: string
	refresh: string
}

export interface ITokensRefresh {
	refreshToken: string
}

export interface IUserLogin {
	email: string
	password: string
}

export interface IAuthError {
	message: string
	status: number
}

export type AuthResponseType<T> = AxiosResponse<T> | IAuthError
