import * as yup from "yup"

const regExpEmail: RegExp = new RegExp(/^\S+@\S+\.\S+$/)

export const schema = yup.object().shape({
	email: yup
		.string()
		.required("Данное поле является обязательным")
		.matches(regExpEmail, "Неверный формат"),
	password: yup
		.string()
		.required("Данное поле является обязательным")
		.min(8, "Недопустимая длинна: минимум 8 символов")
})
