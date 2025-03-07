import type { Metadata } from "next"

import { BookmarksPage } from "@/screens"

export const metadata: Metadata = {
	title: "Закладки",
	description: "",
	robots: {
		index: true,
		follow: true
	}
}

export default function Bookmarks() {
	return <BookmarksPage />
}
