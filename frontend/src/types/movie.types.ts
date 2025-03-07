export interface IMovie {
	id: number // ID
	name: string // Название
	englishName?: string // Название на английском
	alternativeName?: string // Альтернативное название фильма
	description?: string // Описание
	poster: string // Ссылка на постер
	trailer?: string // Ссылка на трейлер
	type: MovieTypeEnum // Тип
	genres: string[] // Список жанров
	rating: number // Рейтинг
	year?: number // Год выпуска
	countries?: string[] // Список стран производства
	directorId?: number // ID режиссёра
	actorsIds?: number[] // ID актёров
	movieLength?: number // Длинна фильма в минутах
	facts?: FactType[] // Список файлов (для квиза)
	local?: boolean
}

export interface MoviesResponse {
	count: number
	next: string
	previous: string
	results: IMovie[]
}

// Тип
export type MovieTypeEnum = (typeof movieTypes)[number]

export const movieTypes: string[] = [
	"movie",
	"tv-series",
	"cartoon",
	"anime",
	"animated-series",
	"tv-show"
]

// Тип для факта (квиз)
export type FactType = {
	fact: string
	is_spoiler: boolean
}
