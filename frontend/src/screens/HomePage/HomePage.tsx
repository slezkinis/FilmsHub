"use client"

import { MoviesGroup } from "@/components/common"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { NavigationEnum } from "@/constants/navigation.constants"
import BookmarksService from "@/services/bookmarks/bookmarks.service"
import MoviesService from "@/services/movies/movies.service"
import styles from "./HomePage.module.scss"

export default function HomePage() {
	const {
		data: likesData,
		isSuccess: isLikesSuccess,
		isLoading: isLikesLoading
	} = useQuery({
		queryKey: ["reminders-likes", 0],
		queryFn: () => BookmarksService.getLiked(),
		select: data => data.results
	})

	const [genre, setGenre] = useState<string>("")

	const { data: genres, isSuccess: isGenresLoaded } = useQuery({
		queryKey: ["genres"],
		queryFn: MoviesService.getGenres,
		enabled: true
	})

	useEffect(() => {
		if (isGenresLoaded && genres && genres.length > 0) {
			setGenre(genres[Math.floor(Math.random() * genres.length)])
		}
	}, [isGenresLoaded, genres])

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ["best-movies", genre],
		queryFn: () => MoviesService.get({ filters: { list_of_genres: genre } }),
		enabled: !!genre,
		select: data => data.results
	})

	return (
		<section className={styles.page}>
			<div className={styles.wrapper}>
				{isLikesLoading && <section>Загрузка...</section>}

				{isLikesSuccess && (
					<MoviesGroup
						refetchKeys={[["reminders-likes", 0]]}
						title="🔥 Буду смотреть"
						moviesArray={likesData}
						href={NavigationEnum.BOOKMARKS + "/liked"}
					/>
				)}

				{isLoading && <section>Загрузка...</section>}

				{isSuccess && (
					<MoviesGroup
						refetchKeys={[["reminders-likes", 0]]}
						title={`Лучшие фильмы жанра "${genre}"`}
						moviesArray={data}
					/>
				)}
			</div>
		</section>
	)
}
