"use client"
import AddIcon from "@mui/icons-material/Add"
import { useQuery } from "@tanstack/react-query"

import { MoviesGroup } from "@/components/common"
import { NavigationEnum } from "@/constants/navigation.constants"
import BookmarksService from "@/services/bookmarks/bookmarks.service"
import { useModalStore } from "@/store/modalStore"
import styles from "./BookmarksPage.module.scss"

export default function BookmarksPage() {
	const setIsModalShow = useModalStore(state => state.setIsAddMovieFormShow)

	const {
		data: likesData,
		isSuccess: isLikesSuccess,
		isLoading: isLikesLoading
	} = useQuery({
		queryKey: ["likes", 0],
		queryFn: () => BookmarksService.getLiked(),
		select: data => data.results
	})

	const { data: asideData, isSuccess: isAsideSuccess } = useQuery({
		queryKey: ["aside", 0],
		queryFn: () => BookmarksService.getAside(),
		select: data => data.results
	})

	const { data: viewedData, isSuccess: isViewedSuccess } = useQuery({
		queryKey: ["viewed", 0],
		queryFn: () => BookmarksService.getViewed(),
		select: data => data.results
	})

	return (
		<section className={styles.page}>
			<div className={styles.wrapper}>
				{isLikesLoading && <section>Загрузка...</section>}

				{isLikesSuccess && (
					<MoviesGroup
						refetchKeys={[
							["likes", 0],
							["aside", 0],
							["viewed", 0]
						]}
						title="🔥 Буду смотреть"
						moviesArray={likesData}
						href={NavigationEnum.BOOKMARKS + "/liked"}
					/>
				)}
				{isAsideSuccess && (
					<MoviesGroup
						refetchKeys={[
							["likes", 0],
							["aside", 0],
							["viewed", 0]
						]}
						title="📺 Буду пересматривать"
						moviesArray={asideData}
						href={NavigationEnum.BOOKMARKS + "/viewed"}
					/>
				)}
				{isViewedSuccess && (
					<MoviesGroup
						refetchKeys={[
							["likes", 0],
							["aside", 0],
							["viewed", 0]
						]}
						title="👀 Просмотрено"
						moviesArray={viewedData}
						href={NavigationEnum.BOOKMARKS + "/aside"}
					/>
				)}

				<button
					className={styles["add_movie-btn"]}
					onClick={() => setIsModalShow(true)}
				>
					<AddIcon />
				</button>
			</div>
		</section>
	)
}
