import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const UseAuthentication: React.FC = ({ children }) => {
	const [auth, setAuth] = useState(null)

	let router = useRouter()
	useEffect(() => {
		const user = localStorage.getItem('user')
		// Kiểm tra trạng thái xác thực của người dùng (ví dụ: kiểm tra roles)
		const parsedUser = JSON.parse(user)
		const isAuthenticated = parsedUser.roles
		// console.log(typeof parsedUser)
		if (isAuthenticated.includes('admin')) {
			router.push('/admin')
			return
		} else if (isAuthenticated.includes('client')) {
			router.push('/employee')
			return
		} else {
			router.push('/order')
			return
		}
		// Hiển thị children (nội dung) nếu người dùng được xác thực
		setAuth(parsedUser.roles)
	}, [])

	return <>{auth && auth}</>
}

export default UseAuthentication
