import { UserPage } from "@/screens"

import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Профиль",
	description: "",
	robots: {
		index: false,
		follow: false
	}
}

export default function User() {
	return <UserPage />
}
