import type {
	ButtonHTMLAttributes,
	DetailedHTMLProps,
	PropsWithChildren
} from "react"

import styles from "./Buttons.module.scss"

interface IProps
	extends PropsWithChildren,
		DetailedHTMLProps<
			ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		> {
	styleType: "primary" | "secondary"
}

export default function Button({
	children,
	styleType = "primary",
	className,
	...props
}: IProps) {
	const getClassName = (): string =>
		className
			? `${styles.button} ${styles[styleType]} ${className}`
			: `${styles.button} ${styles[styleType]}`

	return (
		<button className={getClassName()} {...props}>
			{children}
		</button>
	)
}
