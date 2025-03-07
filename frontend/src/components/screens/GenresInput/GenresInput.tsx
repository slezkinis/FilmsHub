import { useState } from "react"

import { Input } from "@/components/ui"
import styles from "./GenresInput.module.scss"

interface GenreInputProps {
	genres: string[]
	selectedGenres: string[]
	setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>
}

export default function GenreInput({
	genres,
	selectedGenres,
	setSelectedGenres
}: GenreInputProps) {
	const [inputValue, setInputValue] = useState("")
	const [filteredGenres, setFilteredGenres] = useState<string[]>([])

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setInputValue(value)

		if (value) {
			const filtered = genres.filter(genre =>
				genre.toLowerCase().includes(value.toLowerCase())
			)
			setFilteredGenres(filtered)
		} else {
			setFilteredGenres([])
		}
	}

	const handleGenreSelect = (genre: string) => {
		if (!selectedGenres.includes(genre)) {
			setSelectedGenres([...selectedGenres, genre])
		}
		setInputValue("")
		setFilteredGenres([])
	}

	return (
		<div className={styles.genreInputContainer}>
			<Input
				type="text"
				placeholder="Жанр"
				value={inputValue}
				onChange={handleInputChange}
			/>
			{filteredGenres.length > 0 && (
				<ul className={styles.suggestionsList}>
					{filteredGenres.map(genre => (
						<li key={genre} onClick={() => handleGenreSelect(genre)}>
							{genre}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
