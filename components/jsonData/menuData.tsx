import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
	OrderedListOutlined,
} from '@ant-design/icons'
import { MenuProps } from 'antd'
import Link from 'next/link'
import HelperMenu from './helper/menuHelper'
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

export const itemsAdmin = [
	getItem(<Link href="/admin/manage_work">Quản lý ca</Link>, '1', <PieChartOutlined />),
	getItem(<Link href="/admin/manage_location">Quản lí địa điểm</Link>, '2', <DesktopOutlined />),
	getItem(<Link href="/admin/products">Nhập sản phẩm</Link>, '3', <PieChartOutlined />),
	getItem(<Link href="/admin/manage_employee">Quản lý nhân viên</Link>, '4', <DesktopOutlined />),
	getItem('Quản lý đặt bàn', 'sub1', <HelperMenu icon={<UserOutlined />} />, [
		getItem(<Link href="/admin/orders">Đơn các bàn</Link>, 'sub1-1', <PieChartOutlined />),
		getItem(
			<Link href="/admin/request">Yêu cầu</Link>,
			'sub1-2',
			<HelperMenu icon={<PieChartOutlined />} />
		),
		getItem(<Link href="/admin/qrcode">Qr code</Link>, 'sub1-3', <PieChartOutlined />),
	]),
	getItem('Căn tin', 'sub2', <TeamOutlined />, [getItem('Team 1', '9'), getItem('Team 2', '10')]),
	getItem('Thực đơn', '10', <FileOutlined />),
	// getItem(<div>Bán hàng</div>, '11', <PieChartOutlined />),
]

export const itemsEmployee = [
	// getItem(<Link href="/employee/workshift">Quản lý ca</Link>, '1', <PieChartOutlined />),
	// getItem(<Link href="/employee/contact">Quản lý kết nối</Link>, '2', <DesktopOutlined />),
	getItem('Thực đơn', '1', <FileOutlined />),
	getItem(<Link href="/employee/order">Đơn tại bàn</Link>, '2', <OrderedListOutlined />),
	getItem('Quản lý báo cáo', 'sub1', <TeamOutlined />, [
		getItem(<Link href="/employee/warehouse">Kho hàng</Link>, 'sub1-1', <PieChartOutlined />),
		getItem(<Link href="/employee/report">Báo cáo</Link>, 'sub1-2', <FileOutlined />),
	]),
	getItem(<Link href="/employee/manage-table">Quản lý bàn</Link>, '3', <OrderedListOutlined />),
]

export const itemsOrder = [
	getItem(
		<Link href={typeof window !== 'undefined' && window.location.pathname}>Thực đơn</Link>,
		'1',
		<DesktopOutlined />
	),
	getItem(<Link href={'payment'}>Thanh toán</Link>, '2', <TeamOutlined />),
	// getItem('Thanh toán', 'sub3', <TeamOutlined />, [getItem('Team 1', '4'), getItem('Team 2', '5')]),
]
