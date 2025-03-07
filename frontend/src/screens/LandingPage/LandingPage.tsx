"use client"

import { AnimatePresence, motion } from "motion/react"
import { Fragment, useEffect, useState } from "react"

import { Button } from "@/components/ui"
import { NavigationEnum } from "@/constants/navigation.constants"
import { useRouter } from "next/navigation"
import styles from "./LandingPage.module.scss"

export default function LandingPage() {
	const navigation = useRouter()

	const [activeAdvantage, setActiveAdvantage] = useState<number>(0)

	const advantagesList: string[] = [
		"Создавай списки",
		"Находи рекомендации",
		"Голосуй с друзьями"
	]

	useEffect(() => {
		const interval = setInterval(() => {
			if (activeAdvantage < advantagesList.length - 1)
				setActiveAdvantage(prev => prev + 1)
			else setActiveAdvantage(0)
		}, 3000)

		return () => clearInterval(interval)
	})

	const toLoginPage = (): void => {
		navigation.push(NavigationEnum.LOGIN)
	}

	return (
		<section className={styles.page}>
			<div className={styles.wrapper}>
				<p className={styles.slogan}>
					Не можешь выбрать фильм на вечер? Мы поможем!
				</p>

				<div className={styles.info}>
					<h2 className={styles.title}>FilmsHub</h2>
					<ul className={styles.advantages}>
						{advantagesList.map((advantage, index) => (
							<Fragment key={`da-${index}`}>
								<li>{advantage}</li>

								{index < advantagesList.length - 1 && (
									<li className={styles["advantages-separator"]}>|</li>
								)}
							</Fragment>
						))}
					</ul>

					<ul className={styles["advantages-mobile"]}>
						<AnimatePresence mode="wait">
							{advantagesList.map(
								(advantage, index) =>
									activeAdvantage === index && (
										<motion.div
											key={`ma-${index}`}
											initial={{ opacity: 0, y: "-20%" }}
											animate={{
												opacity: 1,
												y: 0,
												transition: {
													duration: 0.25,
													delay: 0.25
												}
											}}
											exit={{
												opacity: 0,
												y: "20%",
												transition: { duration: 0.25 }
											}}
										>
											{advantage}
										</motion.div>
									)
							)}
						</AnimatePresence>
					</ul>
				</div>

				<Button
					onClick={toLoginPage}
					className={styles.btn}
					styleType="primary"
				>
					Начать
				</Button>
			</div>
		</section>
	)
}
