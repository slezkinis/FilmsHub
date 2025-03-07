import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { NavigationEnum } from "@/constants/navigation.constants"
import AuthService from "@/services/auth/auth.service"
import { STORAGE_KEYS } from "./constants/api.constants"

export async function middleware(req: NextRequest) {
	const accessToken = req.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value || ""
	const isAuth = await AuthService.verifyToken(accessToken)

	const url = req.nextUrl.clone()

	const isAuthPage =
		url.pathname === NavigationEnum.LANDING ||
		url.pathname === NavigationEnum.LOGIN ||
		url.pathname === NavigationEnum.REGISTER

	if (url.pathname === "/") {
		if (!isAuth) {
			url.pathname = NavigationEnum.LANDING
			return NextResponse.redirect(url)
		}

		if (isAuth) {
			url.pathname = NavigationEnum.DASHBOARD
			return NextResponse.redirect(url)
		}
	} else {
		if (!isAuth && !isAuthPage) {
			url.pathname = NavigationEnum.LANDING
			return NextResponse.redirect(url)
		}

		if (isAuth && isAuthPage) {
			url.pathname = NavigationEnum.DASHBOARD
			return NextResponse.redirect(url)
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.pdf).*)"
	]
}
