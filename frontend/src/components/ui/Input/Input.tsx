import type { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react"

import styles from "./Input.module.scss"

interface IProps
	extends DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	icon?: ReactNode
}

export default function Input({ className, icon, ...props }: IProps) {
	return (
		<div className={`${styles["input-wrapper"]} ${className || ""}`}>
			<input className={styles.input} {...props} />
			{icon && <span className={styles.icon}>{icon}</span>}
		</div>
	)
}
