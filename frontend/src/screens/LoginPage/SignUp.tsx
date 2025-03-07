"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type ChangeEvent, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"

import { Button, CheckboxWithLabel, Input } from "@/components/ui"
import { NavigationEnum } from "@/constants/navigation.constants"
import AuthService from "@/services/auth/auth.service"
import TokensService from "@/services/auth/tokens.service"
import { IUserLogin } from "@/types/auth.types"
import styles from "./LoginPage.module.scss"
import { schema } from "./validation"

export default function SignUpPage() {
	const navigation = useRouter()

	// Вывод глобальной ошибки
	const [globalError, setGlobalError] = useState<string>("")

	// Двустороннее связывание с чекбоксом
	const [checkboxStatus, setCheckboxStatus] = useState<boolean>(false)

	const onCheckboxChange = (evt: ChangeEvent<HTMLInputElement>): void => {
		setCheckboxStatus(evt.target.checked)
	}

	// Хук для работы с формой
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IUserLogin>({ mode: "onChange", resolver: yupResolver(schema) })

	// Обработка submit
	const submitHandler: SubmitHandler<IUserLogin> = async data => {
		const response = await AuthService.signUp(data)

		if ("message" in response) {
			// Обратка ошибки
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
			TokensService.setTokens(response.data.access, response.data.refresh)
			navigation.replace(NavigationEnum.DASHBOARD)
		}
	}

	return (
		<>
			<h2>Регистрация</h2>

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
					disabled={!checkboxStatus}
					className={styles["submit-btn"]}
					type="submit"
					styleType="primary"
				>
					Создать аккаунт
				</Button>

				<CheckboxWithLabel
					onChange={onCheckboxChange}
					checked={checkboxStatus}
					name="accept-policy"
				>
					<p>
						Соглашаюсь с{" "}
						<a
							href="/policy.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className={styles.link}
						>
							политикой конфиденциальности
						</a>
					</p>
				</CheckboxWithLabel>
			</form>

			<p className={styles["redirect-hint"]}>
				У вас уже есть аккаунт? Тогда{" "}
				<Link className={styles.link} href={NavigationEnum.LOGIN}>
					войдите
				</Link>
			</p>
		</>
	)
}

