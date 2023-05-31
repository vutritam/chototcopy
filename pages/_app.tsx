import '@/styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '@/redux/store/store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import MasterLayout from '@/components/masterLayout/masterLayout'
import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { MenuProps } from 'antd'
import Link from 'next/link'
import PrivateRoute from '@/components/common/privateRoute'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem
}

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const isAdminPage = router.pathname.startsWith('/admin')
	const isEmployeePage = router.pathname.startsWith('/employee')
	const isOrderPage = router.pathname.startsWith('/order')

	const itemsAdmin: MenuItem[] = [
		getItem(<div>Quản lý ca</div>, '1', <PieChartOutlined />),
		getItem('Quản lý kết nối', '2', <DesktopOutlined />),
		getItem(<Link href="/admin/products">Nhập sản phẩm</Link>, '3', <PieChartOutlined />),
		getItem('Quản lý nhân viên', '4', <DesktopOutlined />),
		getItem('Quản lý đặt bàn', 'sub1', <UserOutlined />, [
			getItem('Tom', '5'),
			getItem('Bill', '6'),
			getItem('Alex', '7'),
		]),
		getItem('Căn tin', 'sub2', <TeamOutlined />, [getItem('Team 1', '8'), getItem('Team 2', '9')]),
		getItem('Thực đơn', '10', <FileOutlined />),
		getItem(<div>Bán hàng</div>, '10', <PieChartOutlined />),
	]

	const itemsEmployee: MenuItem[] = [
		getItem(<div>Quản lý ca</div>, '1', <PieChartOutlined />),
		getItem('Quản lý kết nối', '2', <DesktopOutlined />),
		getItem('Quản lý đặt bàn', 'sub1', <UserOutlined />, [
			getItem(<Link href="/employee/order">Đơn tại bàn</Link>, '3', <PieChartOutlined />),
			getItem('Bill', '4'),
			getItem('Alex', '5'),
		]),
		getItem('Căn tin', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
		getItem('Thực đơn', '9', <FileOutlined />),
		getItem(<div>Bán hàng</div>, '10', <PieChartOutlined />),
	]

	const itemsOrder: MenuItem[] = [
		getItem('Thực đơn', '1', <DesktopOutlined />),
		getItem('Khuyến mãi', 'sub2', <TeamOutlined />, [
			getItem('Team 1', '6'),
			getItem('Team 2', '8'),
		]),
		getItem('Ăn vặt', 'sub3', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
	]

	const renderPage = () => {
		if (isAdminPage) {
			return (
				<PrivateRoute>
					<MasterLayout itemsSiderBar={itemsAdmin}>
						<Component {...pageProps} />
					</MasterLayout>
				</PrivateRoute>
			)
		} else if (isEmployeePage) {
			return (
				<PrivateRoute>
					<MasterLayout itemsSiderBar={itemsEmployee}>
						<Component {...pageProps} />
					</MasterLayout>
				</PrivateRoute>
			)
		} else if (isOrderPage) {
			return (
				<MasterLayout itemsSiderBar={itemsOrder}>
					<Component {...pageProps} />
				</MasterLayout>
			)
		}
		return <Component {...pageProps} />
	}

	return (
		<Provider store={store}>
			<ToastContainer />
			{renderPage()}
		</Provider>
	)
}
