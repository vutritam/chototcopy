// MenuData.js
import ItemData from './MenuItemsFactory'
import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { MenuProps } from 'antd'
import Link from 'next/link'
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

export const itemsEmployee = [
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

export const itemsOrder = [
	getItem(
		<Link href={typeof window !== 'undefined' && window.location.pathname}>Thực đơn</Link>,
		'1',
		<DesktopOutlined />
	),
	getItem('Khuyến mãi', 'sub2', <TeamOutlined />, [getItem('Team 1', '2'), getItem('Team 2', '3')]),
	getItem('Ăn vặt', 'sub3', <TeamOutlined />, [getItem('Team 1', '4'), getItem('Team 2', '5')]),
]
