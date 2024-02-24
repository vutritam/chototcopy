import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axiosConfig from '../../pages/api/axiosConfigs'

interface PrivateRouteProps {
	allowedRoles: string[]
	children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
	const router = useRouter()
	const [accessChecked, setAccessChecked] = useState(false)
	let userRoles = sessionStorage.getItem('user')

	useEffect(() => {
		// Kiểm tra xem người dùng có quyền truy cập hay không
		// Sử dụng thông tin về vai trò (roles) lưu trữ trong cookie hoặc bộ nhớ
		// Hoặc gửi yêu cầu đến máy chủ để kiểm tra vai trò của người dùng
		const checkAccess = async () => {
			const parsedUser = userRoles && JSON.parse(userRoles || '')
			if (!userRoles) {
				router.replace('/login')
			} else if (!parsedUser?.data) {
				localStorage.removeItem('user')
				router.replace('/login')
			} else {
				// Ví dụ: Vai trò của người dùng lấy từ thông tin xác thực
				const isAuthen = parsedUser?.data?.roles

				// Kiểm tra xem người dùng có vai trò phù hợp hay không
				const hasAccess = allowedRoles?.some((role) => isAuthen?.includes(role))

				if (!hasAccess) {
					// Không có quyền truy cập, chuyển hướng đến trang báo lỗi hoặc trang chính khác
					router.replace('/404') // Ví dụ: Chuyển hướng đến trang báo lỗi
				}
				setAccessChecked(true)
			}
		}
		checkAccess()
	}, [router, allowedRoles])

	if (!accessChecked) {
		return null // hoặc bất kỳ phần tải nào nếu cần
	}

	return <>{children}</>
}

export default PrivateRoute
