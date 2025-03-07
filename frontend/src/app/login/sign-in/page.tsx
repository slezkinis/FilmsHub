import type { Metadata } from "next"

import { SignInPage } from "@/screens"

export const metadata: Metadata = {
	title: "Авторизация"
}

export default function SignIn() {
	return <SignInPage />
}
