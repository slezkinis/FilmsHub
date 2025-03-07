"use client"

import CloseIcon from "@mui/icons-material/Close"
import DoneIcon from "@mui/icons-material/Done"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"

import BookmarksService from "@/services/bookmarks/bookmarks.service"
import RecommendationService from "@/services/recommendation/recommendation.service"
import styles from "./RecommendationsPage.module.scss"

export default function RecommendationsPage() {
	const { data, isSuccess, isFetching, refetch } = useQuery({
		queryKey: ["recommendation"],
		queryFn: () => RecommendationService.get({ page_size: 1 }),
		select: data => data.results[0]
	})

	const handleLike = async (): Promise<void> => {
		if (isSuccess) {
			await BookmarksService.setLike(data.id)

			refetch()
		}
	}

	const handleView = async (): Promise<void> => {
		if (isSuccess) {
			await BookmarksService.setViewed(data.id)

			refetch()
		}
	}

	const handleDislike = async (): Promise<void> => {
		if (isSuccess) {
			await BookmarksService.setDislike(data.id)

			refetch()
		}
	}

	return (
		<section className={styles.page}>
			<div className={styles.wrapper}>
				<div className={styles.container}>
					<AnimatePresence>
						{!isFetching && isSuccess && (
							<motion.article
								initial={{ y: "20%", opacity: 0 }}
								animate={{ y: 0, opacity: 1, transition: { delay: 0.25 } }}
								exit={{ y: "20%", opacity: 0 }}
								transition={{ duration: 0.25 }}
								className={styles["card"]}
							>
								<img
									className={styles["card-img"]}
									src={data.poster}
									onError={evt => (evt.currentTarget.src = "/plug.png")}
									alt={`Постер фильма ${data.name}`}
								/>

								<div className={styles["card-info"]}>
									<h2 className={styles["card-title"]}>{data.name}</h2>

									{data.year && (
										<span className={styles["card-year"]}>{data.year}</span>
									)}

									{data.description && (
										<p className={styles["card-description"]}>
											{data.description}
										</p>
									)}
								</div>
							</motion.article>
						)}
					</AnimatePresence>
				</div>

				<div className={styles.controls}>
					<button
						onClick={handleDislike}
						className={`${styles["control-btn"]} ${styles["dislike-btn"]}`}
						disabled={isFetching}
					>
						<CloseIcon />
					</button>
					<button
						onClick={handleView}
						className={`${styles["control-btn"]} ${styles["view-btn"]}`}
						disabled={isFetching}
					>
						<VisibilityIcon />
					</button>
					<button
						onClick={handleLike}
						className={`${styles["control-btn"]} ${styles["like-btn"]}`}
						disabled={isFetching}
					>
						<DoneIcon />
					</button>
				</div>
			</div>
		</section>
	)
}

