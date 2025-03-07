import type { Metadata } from "next"

import { FilmsPage } from "@/screens"

export const metadata: Metadata = {
	title: "Все фильмы",
	description: "",
	robots: {
		index: true,
		follow: true
	}
}

export default function Films() {
	return <FilmsPage />
}
