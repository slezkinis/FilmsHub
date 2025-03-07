import type { Metadata } from "next"

import { SignUpPage } from "@/screens"

export const metadata: Metadata = {
	title: "Регистрация"
}

export default function SignUp() {
	return <SignUpPage />
}
