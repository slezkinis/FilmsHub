import {
	DetailedHTMLProps,
	InputHTMLAttributes,
	PropsWithChildren
} from "react"
import CheckboxBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"

import styles from "./Checkbox.module.scss"

type IProps = PropsWithChildren &
	DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export default function CheckboxWithLabel({
	children,
	checked,
	...props
}: IProps) {
	return (
		<label className={styles["checkbox-label"]}>
			<input type="checkbox" checked={checked} {...props} />
			{checked ? <CheckBoxIcon /> : <CheckboxBlankIcon />}
			{children}
		</label>
	)
}
