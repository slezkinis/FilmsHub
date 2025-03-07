"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import { Button, Input } from "@/components/ui"
import { NavigationEnum } from "@/constants/navigation.constants"
import AuthService from "@/services/auth/auth.service"
import tokensService from "@/services/auth/tokens.service"
import { IUserLogin } from "@/types/auth.types"
import styles from "./LoginPage.module.scss"
import { schema } from "./validation"

export default function SignInPage() {
	const navigation = useRouter()

	const [globalError, setGlobalError] = useState<string>("")

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IUserLogin>({ mode: "onChange", resolver: yupResolver(schema) })

	const submitHandler: SubmitHandler<IUserLogin> = async data => {
		const response = await AuthService.signIn(data)

		if ("message" in response) {
			// Обработка ошибки
			setGlobalError(
				String(response.message).charAt(0).toUpperCase() +
					String(response.message).slice(
						1,
						String(response.message).charAt(response.message.length - 1) === "."
							? -1
							: response.message.length
					)
			)
		} else {
			// Обработка данных
			setGlobalError("")
			tokensService.setTokens(response.data.access, response.data.refresh)
			navigation.replace(NavigationEnum.DASHBOARD)
		}
	}

	return (
		<>
			<h2>Вход</h2>

			<form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
				<div>
					<Input
						{...register("email")}
						placeholder="Email"
						icon={<AlternateEmailOutlinedIcon />}
						name="email"
						autoComplete="email"
						type="email"
					/>

					{errors.email && (
						<p className={styles.error}>{errors.email.message}</p>
					)}
				</div>

				<div>
					<Input
						{...register("password")}
						placeholder="Пароль"
						icon={<LockOutlinedIcon />}
						name="password"
						type="password"
					/>
					{errors.password && (
						<p className={styles.error}>{errors.password.message}</p>
					)}
				</div>

				{globalError && <p className={styles["global-error"]}>{globalError}</p>}

				<Button
					className={styles["submit-btn"]}
					type="submit"
					styleType="primary"
				>
					Войти
				</Button>
			</form>

			<p className={styles["redirect-hint"]}>
				У вас ещё нет аккаунта? Тогда{" "}
				<Link className={styles.link} href={NavigationEnum.REGISTER}>
					зарегистрируйтесь
				</Link>
			</p>
		</>
	)
}

