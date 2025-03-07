"use client"

import CloseIcon from "@mui/icons-material/Close"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import BookmarksService from "@/services/bookmarks/bookmarks.service"
import MoviesService from "@/services/movies/movies.service"
import { useModalStore } from "@/store/modalStore"
import { type IMovie, movieTypes } from "@/types/movie.types"
import GenreInput from "../screens/GenresInput/GenresInput"
import { Button, Input } from "../ui"
import styles from "./NewMovieForm.module.scss"

type NewMovieType = Omit<IMovie, "id">

export default function NewMovieForm() {
	const isModalActive = useModalStore(state => state.isAddMovieFormShow)
	const setIsModalActive = useModalStore(state => state.setIsAddMovieFormShow)

	const queryClient = useQueryClient()

	const movieTypesLabels: string[] = [
		"Фильм",
		"Сериал",
		"Мультфильм",
		"Аниме",
		"Мультсериал",
		"ТВ-шоу"
	]

	const [genres, setGenres] = useState<string[]>([])
	const [selectedGenres, setSelectedGenres] = useState<string[]>([])

	const [globalError, setGlobalError] = useState<string>("")

	const { data, isSuccess } = useQuery({
		queryKey: ["genres-list"],
		queryFn: () => MoviesService.getGenres()
	})

	useEffect(() => {
		if (isSuccess) setGenres(data)
	}, [isSuccess])

	useEffect(() => {
		setGlobalError("")
	}, [genres])

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<NewMovieType>({
		mode: "onChange"
	})

	const submitHandler: SubmitHandler<Omit<IMovie, "id">> = async data => {
		if (selectedGenres.length < 1)
			setGlobalError("Нужно выбрать хотя бы один жанр")

		const response = await MoviesService.addNew({
			...data,
			poster: "https://amazing-site.com",
			genres: selectedGenres,
			year: 2001
		})

		if (response.status === 201) {
			reset()
			setSelectedGenres([])
			setIsModalActive(false)

			await BookmarksService.setLike(response.data.id)

			queryClient.invalidateQueries({ queryKey: ["likes", 0] })
		}
	}

	return (
		<AnimatePresence>
			{isModalActive && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setIsModalActive(false)}
					className={styles.overlay}
				>
					<button
						className={styles["close-btn"]}
						onClick={() => setIsModalActive(false)}
						title="Закрыть модальное окно"
					>
						<CloseIcon />
					</button>

					<section
						onClick={evt => evt.stopPropagation()}
						className={styles.modal}
					>
						<h2>Добавить свой фильм</h2>

						<form
							onSubmit={handleSubmit(submitHandler)}
							className={styles.form}
						>
							<div>
								<Input
									{...register("name", {
										required: {
											value: true,
											message: "Данное поля является обязательным"
										},
										minLength: {
											value: 1,
											message: "Недопустимая длинна: минимум 1 символ"
										},
										maxLength: {
											value: 100,
											message: "Недопустимая длинна: максимум 100 символов"
										}
									})}
									placeholder="Название"
									type="text"
									name="name"
								/>
								{errors.name && (
									<p className={styles.error}>{errors.name.message}</p>
								)}
							</div>

							<div>
								<select
									{...register("type")}
									className={styles.select}
									name="type"
								>
									{movieTypes.map((type, index) => (
										<option key={type} value={type}>
											{movieTypesLabels[index]}
										</option>
									))}
								</select>
								{errors.type && (
									<p className={styles.error}>{errors.type.message}</p>
								)}
							</div>

							<div>
								<GenreInput
									genres={genres}
									selectedGenres={selectedGenres}
									setSelectedGenres={setSelectedGenres}
								/>
								{selectedGenres.length > 0 && (
									<>
										<p className={styles["selected-genres"]}>
											Выбранные жанры: {selectedGenres.join(", ")}
										</p>
										<button
											className={styles["genres-btn"]}
											onClick={() => setSelectedGenres([])}
											type="button"
										>
											Сбросить
										</button>
									</>
								)}
							</div>

							<div>
								<Input
									placeholder="Ссылка на постер"
									type="text"
									name="poster-link"
								/>
								{errors.poster && (
									<p className={styles.error}>{errors.poster.message}</p>
								)}
							</div>

							<div>
								<Input
									{...register("rating", {
										required: {
											value: true,
											message: "Данное поле является обязательным"
										},
										valueAsNumber: true,
										min: {
											value: 1.0,
											message: "Недопустимое значение: минимум 1"
										},
										max: {
											value: 10.0,
											message: "Недопустимое значение: максимум 10"
										}
									})}
									placeholder="Рейтинг"
									type="number"
									name="rating"
								/>
								{errors.rating && (
									<p className={styles.error}>{errors.rating.message}</p>
								)}
							</div>

							<Input
								{...register("description")}
								placeholder="Описание"
								type="text"
								name="description"
							/>

							{globalError && (
								<p className={styles["global-error"]}>{globalError}</p>
							)}

							<Button type="submit" styleType="primary">
								Сохранить
							</Button>
						</form>
					</section>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
