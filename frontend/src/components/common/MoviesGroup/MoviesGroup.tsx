"use client"
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { IMovie } from "@/types/movie.types"
import { MovieCard } from "../MovieCard"
import styles from "./MoviesGroup.module.scss"

interface IProps {
	title: string
	moviesArray: IMovie[]
	className?: string
	href?: string
	refetchKeys: (string | number)[][]
}

export default function MoviesGroup({
	title,
	moviesArray,
	className,
	href,
	refetchKeys
}: IProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [isScrollable, setIsScrollable] = useState(false)

	useEffect(() => {
		const checkScroll = () => {
			if (containerRef.current) {
				setIsScrollable(
					containerRef.current.scrollWidth > containerRef.current.clientWidth
				)
			}
		}

		checkScroll()
		window.addEventListener("resize", checkScroll)
		return () => window.removeEventListener("resize", checkScroll)
	}, [moviesArray.length])

	return (
		<section
			className={
				className
					? className + " " + styles["movies-group"]
					: styles["movies-group"]
			}
		>
			<div className={styles.title}>
				<h2>{title}</h2>

				{href && moviesArray.length > 0 && <Link href={href}>все</Link>}
			</div>

			{moviesArray.length > 0 ? (
				<>
					<div className={styles["movies-line"]} ref={containerRef}>
						{moviesArray.map(({ id, name, poster, year, rating, local }) => (
							<MovieCard
								className={styles["movies-group-item"]}
								key={id}
								id={id}
								image={poster}
								name={name}
								year={year}
								rating={rating}
								refetchKeys={refetchKeys}
								local={local}
							/>
						))}
					</div>
					{isScrollable && (
						<>
							<button
								className={styles["scroll-btn"]}
								onClick={() =>
									containerRef?.current &&
									containerRef.current.scrollBy({
										left: -containerRef.current.clientWidth + 160,
										behavior: "smooth"
									})
								}
							>
								<ArrowBackIcon />
							</button>
							<button
								className={styles["scroll-btn"]}
								onClick={() =>
									containerRef?.current &&
									containerRef.current.scrollBy({
										left: containerRef.current.clientWidth - 160,
										behavior: "smooth"
									})
								}
							>
								<ArrowForwardIcon />
							</button>
						</>
					)}
				</>
			) : (
				<div className={styles["no-content"]}>Пока что тут пусто...</div>
			)}
		</section>
	)
}
