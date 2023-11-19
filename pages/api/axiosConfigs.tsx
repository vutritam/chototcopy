import axios from 'axios'

const token = 'your-auth-token'
const ENV_HOST = process.env.NEXT_PUBLIC_HOST
const api = axios.create({
	baseURL: ENV_HOST,
	timeout: 5000,
	headers: {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})

export default api
