import styles from "./PaginationSwitchers.module.scss"
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos"

interface IProps {
	page: number
	count: number
	setPage: (x: number) => void
}

export default function PaginationSwitchers({ page, count, setPage }: IProps) {
	const maxPage = Math.ceil(count / 20)
	return (
		<div className={styles["switching"]}>
			<button
				className={styles["switch-btn"]}
				disabled={page == 1}
				onClick={() => {
					window.scrollTo({ top: 0 })
					setPage(Math.max(1, page - 1))
				}}
			>
				<ArrowBackIcon />
			</button>
			<p>
				{page} / {maxPage}
			</p>
			<button
				className={styles["switch-btn"]}
				disabled={page == maxPage}
				onClick={() => {
					window.scrollTo({ top: 0 })
					setPage(Math.min(maxPage, page + 1))
				}}
			>
				<ArrowForwardIcon />
			</button>
		</div>
	)
}
