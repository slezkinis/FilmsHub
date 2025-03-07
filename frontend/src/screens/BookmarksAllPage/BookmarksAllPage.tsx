"use client"
import { useState } from "react"
import { useParams, notFound } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import BookmarksService from "@/services/bookmarks/bookmarks.service"
import styles from "./BookmarksAllPage.module.scss"
import { MovieCard } from "@/components/common"
import { PaginationSwitchers } from "@/components/common"

export default function BookmarksAllPage() {
	const params = useParams()

	const [page, setPage] = useState(1)

	if (
		params.bookmarkType != "liked" &&
		params.bookmarkType != "viewed" &&
		params.bookmarkType != "aside"
	)
		notFound()

	const title =
		params.bookmarkType == "liked"
			? "Буду смотреть"
			: params.bookmarkType == "viewed"
				? "Просмотрено"
				: "Буду пересматривать"

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: [params.bookmarkType, page],
		queryFn: () =>
			params.bookmarkType == "liked"
				? BookmarksService.getLiked(page)
				: params.bookmarkType == "viewed"
					? BookmarksService.getViewed(page)
					: BookmarksService.getAside(page)
	})

	if (isLoading) return <section>Загрузка...</section>

	if (isSuccess) {
		return (
			<section className={styles.page}>
				<div className={styles.wrapper}>
					<h2>{title}</h2>
					<div className={styles.content}>
						{data.results.map(({ name, id, poster, rating, year, local }) => (
							<MovieCard
								id={id}
								key={id}
								className={styles.card}
								refetchKeys={[[params.bookmarkType as string, page]]}
								name={name}
								image={poster}
								rating={rating}
								year={year}
								local={local}
							/>
						))}
					</div>
					<PaginationSwitchers
						page={page}
						count={data.count}
						setPage={setPage}
					/>
				</div>
			</section>
		)
	}
}
