import { create } from "zustand"

interface IModalStore {
	isAddMovieFormShow: boolean
	setIsAddMovieFormShow: (newValue: boolean) => void
}

export const useModalStore = create<IModalStore>(set => ({
	isAddMovieFormShow: false,
	setIsAddMovieFormShow: newValue => set({ isAddMovieFormShow: newValue })
}))
