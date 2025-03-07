import type { Metadata } from "next"

import { RecommendationsPage } from "@/screens"

export const metadata: Metadata = {
	title: "Рекомендации",
	description: "",
	robots: {
		index: true,
		follow: true
	}
}

export default function Recommendations() {
	return <RecommendationsPage />
}
