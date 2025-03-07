"use client"
import { useState } from "react"
import { motion } from "motion/react"

import RecommendationService from "@/services/recommendation/recommendation.service"
import styles from "./AI.module.scss"

const container = {
	hidden: { opacity: 1 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
	}
}

const letter = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 }
}

export default function AI({}) {
	const [opened, setOpened] = useState(false)
	const [mode, setMode] = useState("wish")
	const [prompt, setPrompt] = useState("")
	const [ans, setAns] = useState("")
	const handleSubmitWish = async () => {
		const response = await RecommendationService.wish(prompt)
		setAns(response.result)
	}
	const handleSubmitSimilar = async () => {
		const response = await RecommendationService.similar(prompt)
		console.log(response)
		setAns(response.result)
	}

	return (
		<div className={styles.wrapper}>
			<button
				className={styles["ai-button"]}
				onClick={() => setOpened(!opened)}
			>
				Быстрый поиск с AI
			</button>
			<div
				className={
					!opened ? styles.content : styles.content + " " + styles.active
				}
			>
				<div>
					<div className={styles["mode-change-wrapper"]}>
						<button
							className={styles["change-mode"]}
							onClick={() => setMode("wish")}
						>
							<span>Найти по описанию</span>
							{mode == "wish" && (
								<motion.div
									layoutId="change-mode"
									className={styles["mode-change-indicator"]}
								/>
							)}
						</button>
						<button
							className={styles["change-mode"]}
							onClick={() => setMode("similar")}
						>
							<span>Найти похожие</span>
							{mode == "similar" && (
								<motion.div
									layoutId="change-mode"
									className={styles["mode-change-indicator"]}
								/>
							)}
						</button>
					</div>
					<textarea
						placeholder={
							mode == "wish" ? "Введите описание" : "Введите название фильма"
						}
						className={styles.textarea}
						value={prompt}
						onChange={e => setPrompt(e.target.value)}
					></textarea>
					<button
						className={styles["ai-button"]}
						onClick={mode == "wish" ? handleSubmitWish : handleSubmitSimilar}
					>
						Отправить
					</button>
					<div>{ans}</div>
				</div>
			</div>
		</div>
	)
}
