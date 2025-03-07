import axios from "axios"

import { EndpointsEnum, SERVER_URL } from "@/constants/api.constants"

class TestService {
	async getStatus() {
		return await axios.get(SERVER_URL + EndpointsEnum.TEST.GET_STATUS, {
			headers: { "Content-Type": "application/json" }
		})
	}
}

export default new TestService()
