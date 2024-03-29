import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface Props {
	// Các props của component
}

const withAuthorization = (
	WrappedComponent: React.ComponentType<Props>,
	allowedRoles: string[]
) => {
	const RequiresAuthorization: React.FC<Props> = (props) => {
		const router = useRouter()
		let userRoles = sessionStorage.getItem('user')
		console.log(userRoles, 'user')

		useEffect(() => {
			// Kiểm tra xem người dùng có quyền truy cập hay không
			// Sử dụng thông tin về vai trò (roles) lưu trữ trong cookie hoặc bộ nhớ
			// Hoặc gửi yêu cầu đến máy chủ để kiểm tra vai trò của người dùng
			const parsedUser = userRoles && JSON.parse(userRoles || '')
			if (!userRoles) {
				router.push('/login')
			} else if (!parsedUser?.data) {
				localStorage.removeItem('user')
				router.push('/login')
			} else {
				// Ví dụ: Vai trò của người dùng lấy từ thông tin xác thực

				const isAuthen = parsedUser?.data?.roles

				// Kiểm tra xem người dùng có vai trò phù hợp hay không
				const hasAccess = allowedRoles?.some((role) => isAuthen?.includes(role))

				if (!hasAccess) {
					// Không có quyền truy cập, chuyển hướng đến trang báo lỗi hoặc trang chính khác
					router.back() // Ví dụ: Chuyển hướng đến trang báo lỗi
				}
			}
		}, [router])

		if (allowedRoles.length === 0) {
			return <WrappedComponent {...props} />
		}

		return null
	}

	return RequiresAuthorization
}

export default withAuthorization
