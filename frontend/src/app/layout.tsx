import type { Metadata } from "next"
import { Inter, Orbitron, Prosto_One } from "next/font/google"

import Providers from "@/components/Providers"
import "@/scss/globals.scss"

// Метадата
export const metadata: Metadata = {
	title: {
		template: "%s | FilmsHub",
		default: "FilmsHub"
	},
	twitter: {
		card: "summary_large_image"
	},
	authors: []
}

// Шрифты
const orbitronFont = Orbitron({
	subsets: ["latin"],
	weight: "600",
	style: "normal",
	variable: "--logo-font"
})

const prostoFont = Prosto_One({
	subsets: ["cyrillic", "latin"],
	weight: "400",
	style: "normal",
	variable: "--heading-font"
})

const interFont = Inter({
	subsets: ["cyrillic", "latin"],
	weight: ["400", "500", "600"],
	style: "normal",
	variable: "--default-font"
})

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ru">
			<body
				className={`${orbitronFont.variable} ${prostoFont.variable} ${interFont.variable}`}
			>
				<Providers>
					<main className="main">{children}</main>
				</Providers>
			</body>
		</html>
	)
}
