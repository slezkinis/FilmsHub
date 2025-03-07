"use client"
import { ChangeEvent, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import SearchIcon from "@mui/icons-material/Search"

import { PaginationSwitchers } from "@/components/common"
import MoviesService from "@/services/movies/movies.service"
import { Input } from "@/components/ui"
import { MovieCard } from "@/components/common"
import AI from "@/components/screens/FilmsPage/AI/AI"
import styles from "./FilmsPage.module.scss"

export default function FilmsPage() {
	const [search, setSearch] = useState<string>("")
	const [page, setPage] = useState(1)

	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ["search", page],
		queryFn: () => MoviesService.get({ page, filmName: search })
	})

	const onInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
		setSearch(evt.target.value)
	}

	useEffect(() => {
		setPage(1)
		refetch()
	}, [search])

	return (
		<section className={styles.page}>
			<div className={styles.wrapper}>
				<h2>Все фильмы</h2>
				<Input
					className={styles.search}
					onChange={onInputChange}
					value={search}
					placeholder="Поиск фильма"
					icon={<SearchIcon />}
				/>
			</div>
			<AI />
			<div className={styles.wrapper}>
				{isLoading && <p>Загрузка...</p>}
				{isSuccess && data.count > 0 ? (
					<>
						<div className={styles.content}>
							{data.results.map(({ name, id, poster, rating, year, local }) => (
								<MovieCard
									id={id}
									key={id}
									className={styles.card}
									refetchKeys={[["search", page]]}
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
					</>
				) : (
					<p>Ничего не найдено</p>
				)}
			</div>
		</section>
	)
}
