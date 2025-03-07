"use client"

import CloseIcon from "@mui/icons-material/Close"
import MenuIcon from "@mui/icons-material/Menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { NavigationEnum } from "@/constants/navigation.constants"
import AuthService from "@/services/auth/auth.service"
import TokensService from "@/services/auth/tokens.service"
import UserService from "@/services/user/user.service"
import styles from "./AppHeader.module.scss"

export default function AppHeader() {
	const [isShow, setIsShow] = useState<boolean>(false)

	const pathname = usePathname()

	const [opened, setOpened] = useState<boolean>(false)

	const handleClick = (): void => {
		window.scrollTo({ top: 0 })

		setOpened(false)
	}

	const logout = (): void => {
		UserService.logout().then(res => location.reload())
	}

	useEffect(() => {
		const accessToken = TokensService.getAccessToken()

		if (accessToken) {
			AuthService.verifyToken(accessToken).then(res => setIsShow(res))
		} else {
			setIsShow(false)
		}
	}, [pathname])

	return (
		isShow && (
			<>
				<header className={styles.header}>
					<div className={styles.content}>
						<Link onClick={handleClick} href={NavigationEnum.DASHBOARD}>
							<h1 className={styles.logo}>FilmsHub</h1>
						</Link>
						<nav
							className={
								opened
									? styles.navigation + " " + styles.active
									: styles.navigation
							}
						>
							<div>
								<Link
									className={
										pathname === NavigationEnum.DASHBOARD
											? `${styles.link} ${styles.active}`
											: styles.link
									}
									onClick={handleClick}
									href={NavigationEnum.DASHBOARD}
								>
									Главная
								</Link>
								<Link
									className={
										pathname === NavigationEnum.ALL_FILMS
											? `${styles.link} ${styles.active}`
											: styles.link
									}
									onClick={handleClick}
									href={NavigationEnum.ALL_FILMS}
								>
									Все фильмы
								</Link>
								<Link
									className={
										pathname === NavigationEnum.RECOMMENDATIONS
											? `${styles.link} ${styles.active}`
											: styles.link
									}
									onClick={handleClick}
									href={NavigationEnum.RECOMMENDATIONS}
								>
									Рекомендации
								</Link>
								<Link
									className={
										pathname === NavigationEnum.BOOKMARKS
											? `${styles.link} ${styles.active}`
											: styles.link
									}
									onClick={handleClick}
									href={NavigationEnum.BOOKMARKS}
								>
									Мои фильмы
								</Link>
								<button
									className={
										pathname === NavigationEnum.USER
											? `${styles.link} ${styles.active}`
											: styles.link
									}
									onClick={logout}
								>
									Выйти
								</button>
							</div>
						</nav>
						<button
							className={styles.burger}
							onClick={() => setOpened(!opened)}
						>
							{opened ? <CloseIcon /> : <MenuIcon />}
						</button>
					</div>
				</header>
				<div
					className={
						opened ? styles.overlay + " " + styles.active : styles.overlay
					}
					onClick={() => setOpened(false)}
				></div>
			</>
		)
	)
}
