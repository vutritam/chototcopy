import '@/styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
// import { store, persistor } from '';
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
// import PrivateRoute from '@/components/common/privateRoute'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@/redux/store/store'
import { useState } from 'react'

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
	const [selectedItemKey, setSelectedItemKey] = useState(null)

	const handleMenuClick = (item) => {
		console.log(item.key, 'item')

		if (item) {
			sessionStorage.setItem('clickItemChecked', item.key)
		}
	}

	// // Lấy giá trị item từ query string và cập nhật trạng thái cho menu item
	// useEffect(() => {
	// 	const { item } = router.query
	// 	console.log(item, 'useEffect')

	// 	if (item) {
	// 		setSelectedItemKey(item) // Lưu key của item từ query string vào state
	// 	}
	// }, [])
	const itemsAdmin: MenuItem[] = [
		getItem(<div>Quản lý ca</div>, '1', <PieChartOutlined />),
		getItem(<Link href="/admin/manage_work">Quản lí kết nối</Link>, '2', <DesktopOutlined />),
		getItem(<Link href="/admin/products">Nhập sản phẩm</Link>, '3', <PieChartOutlined />),
		getItem(<Link href="/admin/manage_employee">Quản lý nhân viên</Link>, '4', <DesktopOutlined />),
		getItem('Quản lý đặt bàn', 'sub1', <UserOutlined />, [
			getItem(<Link href="/admin/orders">Đơn các bàn</Link>, '5', <PieChartOutlined />),
		]),
		getItem('Căn tin', 'sub2', <TeamOutlined />, [getItem('Team 1', '9'), getItem('Team 2', '10')]),
		getItem('Thực đơn', '10', <FileOutlined />),
		getItem(<div>Bán hàng</div>, '11', <PieChartOutlined />),
	]

	const itemsEmployee: MenuItem[] = [
		getItem(<div>Quản lý ca</div>, '1', <PieChartOutlined />),
		getItem(<Link href="/employee/contact">Quản lý kết nối</Link>, '2', <DesktopOutlined />),
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
		getItem(
			<Link href={typeof window !== 'undefined' && window.location.pathname}>Thực đơn</Link>,
			'1',
			<DesktopOutlined />
		),
		getItem('Khuyến mãi', 'sub2', <TeamOutlined />, [
			getItem('Team 1', '2'),
			getItem('Team 2', '3'),
		]),
		getItem('Ăn vặt', 'sub3', <TeamOutlined />, [getItem('Team 1', '4'), getItem('Team 2', '5')]),
	]

	const renderPage = () => {
		if (isAdminPage) {
			return (
				// <PrivateRoute>
				<MasterLayout
					itemsSiderBar={itemsAdmin}
					isPage="admin"
					selectedItemKey={selectedItemKey}
					handleMenuClick={handleMenuClick}
				>
					<Component {...pageProps} />
				</MasterLayout>
				// </PrivateRoute>
			)
		} else if (isEmployeePage) {
			return (
				// <PrivateRoute>
				<MasterLayout
					itemsSiderBar={itemsEmployee}
					isPage="employee"
					selectedItemKey={selectedItemKey}
					handleMenuClick={handleMenuClick}
				>
					<Component {...pageProps} />
				</MasterLayout>
				// </PrivateRoute>
			)
		} else if (isOrderPage) {
			return (
				<MasterLayout
					itemsSiderBar={itemsOrder}
					isPage="order"
					selectedItemKey={selectedItemKey}
					handleMenuClick={handleMenuClick}
				>
					<Component {...pageProps} />
				</MasterLayout>
			)
		}
		return <Component {...pageProps} />
	}

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ToastContainer />
				{renderPage()}
			</PersistGate>
		</Provider>
	)
}
