import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import Toasty from './toasty'

interface PrivateRouteProps {
	children: ReactNode
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }: PrivateRouteProps) => {
	const router = useRouter()

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const user = localStorage.getItem('user')
			// Kiểm tra xem người dùng đã đăng nhập hay chưa
			if (!user) {
				// Chuyển hướng đến trang đăng nhập nếu không có thông tin người dùng trong localStorage
				router.push('/login')
			} else {
				// Kiểm tra quyền truy cập của người dùng
				const parsedUser = JSON.parse(user)
				const isAdmin = parsedUser?.roles?.includes('admin')

				// Chuyển hướng đến trang tương ứng với quyền truy cập của người dùng
				if (isAdmin) {
					router.push('/admin')
				} else {
					router.push('/employee')
				}
			}
		}
	}, [])

	// Hiển thị children (nội dung) nếu người dùng được xác thực
	return <>{children}</>
}

export default PrivateRoute
