"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import BookmarksService from "@/services/bookmarks/bookmarks.service"
import MoviesService from "@/services/movies/movies.service"
import styles from "./MovieCard.module.scss"
import { button } from "motion/react-client"

interface IProps {
	id: number
	image: string
	name: string
	year?: number
	rating: number
	className?: string
	refetchKeys: (string | number)[][]
	local?: boolean
}

export default function MovieCard({
	id,
	image,
	name,
	year,
	rating,
	className,
	refetchKeys,
	local
}: IProps) {
	const [openActions, setOpenActions] = useState(false)

	const queryClient = useQueryClient()

	const { data, isSuccess, refetch } = useQuery({
		queryKey: ["movie-bookmark-status", id],
		queryFn: () => BookmarksService.getCurrent(id)
	})

	const ratingClass = (): string =>
		rating >= 7
			? styles["good"]
			: rating < 3
				? styles["bad"]
				: styles["average"]

	const addTo = async (
		bookmarkType: "aside" | "like" | "viewed"
	): Promise<void> => {
		switch (bookmarkType) {
			case "like":
				await BookmarksService.setLike(id)
				break
			case "viewed":
				await BookmarksService.setViewed(id)
				break
			case "aside":
				await BookmarksService.setAside(id)
				break
		}

		refetchAll()
	}

	const removeFromBookmarks = async (): Promise<void> => {
		await BookmarksService.removeFromBookmarks(id)

		refetchAll()
	}

	const refetchAll = (): void => {
		refetch()
		refetchKeys.forEach(queryKey => {
			queryClient.invalidateQueries({
				queryKey: queryKey
			})
		})
	}

	return (
		<div
			className={
				className
					? styles["movie-card"] + " " + className
					: styles["movie-card"]
			}
			onClick={() => setOpenActions(!openActions)}
		>
			<img
				src={image}
				onError={evt => {
					evt.currentTarget.src = "/plug.png"
				}}
				alt="постер фильма"
			/>
			<div className={styles["content"]}>
				<h3 title={name}>{name}</h3>
				<div className={styles["sub"]}>
					<span>{year}</span>
					<strong className={ratingClass()}>{rating.toFixed(1)}</strong>
				</div>
			</div>
			<AnimatePresence>
				{openActions && (
					<motion.div
						initial={{ height: 0 }}
						animate={{ height: "auto" }}
						exit={{ height: 0 }}
						className={styles["actions"]}
					>
						{isSuccess && (
							<>
								{local && (
									<button onClick={() => MoviesService.remove(id)}>
										Удалить
									</button>
								)}
								{data.type === "like" ? (
									<button
										className={styles.selected}
										onClick={() => removeFromBookmarks()}
									>
										Убрать из закладок
									</button>
								) : (
									<button onClick={() => addTo("like")}>Буду смотреть</button>
								)}

								{data.type === "aside" ? (
									<button
										className={styles.selected}
										onClick={() => removeFromBookmarks()}
									>
										Убрать из закладок
									</button>
								) : (
									<button onClick={() => addTo("aside")}>
										Смотрел, буду пересматривать
									</button>
								)}

								{data.type === "viewed" ? (
									<button
										className={styles.selected}
										onClick={() => removeFromBookmarks()}
									>
										Убрать из закладок
									</button>
								) : (
									<button onClick={() => addTo("viewed")}>
										Смотрел, больше не интересно
									</button>
								)}
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
