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
	styleType: "default" | "danger"
}

export default function OutlinedButton({
	children,
	styleType = "default",
	className,
	...props
}: IProps) {
	const getClassName = (): string =>
		className
			? `${styles["outlined-button"]} ${styles[styleType]} ${className}`
			: `${styles["outlined-button"]} ${styles[styleType]}`

	return (
		<button className={getClassName()} {...props}>
			{children}
		</button>
	)
}
