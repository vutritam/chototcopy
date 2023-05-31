import axios from 'axios'

const token = 'your-auth-token'
const api = axios.create({
	baseURL: 'http://localhost:3500',
	timeout: 5000,
	headers: {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})

export default api
