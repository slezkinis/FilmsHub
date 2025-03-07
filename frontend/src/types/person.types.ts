export interface IPerson {
	id: number // ID
	name: string // Имя
	photo?: string // Ссылка на фото
	englishName?: string // Имя (на английском)
}

export interface IPersonRequest {
	count: number
	next: string
	previous: string
	result: IPerson[]
}
