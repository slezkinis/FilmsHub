"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

import AppHeader from "./AppHeader"
import NewMovieForm from "./modals/NewMovieForm"
import { useModalStore } from "@/store/modalStore"

const queryClient = new QueryClient()

export default function Providers({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<QueryClientProvider client={queryClient}>
			<AppHeader />

			{children}

			<NewMovieForm />
		</QueryClientProvider>
	)
}

