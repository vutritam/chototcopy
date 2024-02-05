import { useRouter } from 'next/router'
import { useEffect } from 'react'
import axiosConfig from '../../pages/api/axiosConfigs'

export async function getServerSideProps(context) {
	// Lấy cookie "token" từ request
	// const token = context.req.cookies.token
	console.log(context, 'contexxt')

	// Xác thực token bằng cách gọi API
	// let response = await axiosConfig.post('/auth/login', options)
	// return response.data

	// // Kiểm tra response
	// if (response.status === 200) {
	// 	// Người dùng đã đăng nhập
	// 	return {
	// 		props: {
	// 			user: await response.json(),
	// 		},
	// 	}
	// } else {
	// 	// Người dùng chưa đăng nhập
	// 	// Chuyển hướng đến trang đăng nhập
	// 	return {
	// 		redirect: {
	// 			destination: '/login',
	// 			permanent: false,
	// 		},
	// 	}
	// }
}
interface PrivateRouteProps {
	allowedRoles: string[]
	children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
	const router = useRouter()
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
			}
		}

		checkAccess()
	}, [router, allowedRoles])

	if (allowedRoles.length !== 0) {
		return <>{children}</>
	}

	return null
}

export default PrivateRoute
