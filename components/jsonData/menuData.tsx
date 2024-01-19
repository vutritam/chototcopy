import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
	MailOutlined,
	SettingOutlined,
	CalendarOutlined,
} from '@ant-design/icons'
import { Badge, MenuProps } from 'antd'
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
// function getItem(
// 	label: React.ReactNode,
// 	key: React.Key,
// 	path?: React.ReactNode,
// 	icon?: React.ReactNode,
// 	children?: MenuItem[]
// ): MenuItem {
// 	return {
// 		label,
// 		key,
// 		path,
// 		icon,
// 		children,
// 	} as MenuItem
// }
// export const itemsAdmin = [
// 	{
// 		title: 'Quản lý ca',
// 		key: 'sub1',
// 		icon: <PieChartOutlined />,
// 	},
// 	{
// 		title: 'Quản lí kết nối',
// 		key: 'sub2',
// 		icon: <DesktopOutlined />,
// 	},
// 	{
// 		title: <Link href="/admin/products">Nhập sản phẩm</Link>,
// 		key: 'sub3',
// 		icon: <DesktopOutlined />,
// 	},
// 	{
// 		title: 'Quản lý nhân sự',
// 		key: 'sub4',
// 		icon: <DesktopOutlined />,
// 		children: [
// 			{
// 				title: <Link href="/admin/manage_employee">Nhân viên</Link>,
// 				key: 'sub4-1',
// 				icon: <SettingOutlined />,
// 			},
// 			{
// 				title: <Link href="/admin/request">Yêu cầu</Link>,
// 				key: 'sub4-2',
// 				icon: <CalendarOutlined />,
// 			},
// 		],
// 	},
// 	{
// 		title: 'Quản lý đặt bàn',
// 		key: 'sub5',
// 		icon: <MailOutlined />,
// 		children: [
// 			{
// 				title: <Link href="/admin/orders">Đơn các bàn</Link>,
// 				key: 'sub5-1',
// 				icon: <SettingOutlined />,
// 			},
// 		],
// 	},
// 	{
// 		title: 'Thực đơn',
// 		key: 'sub6',
// 		icon: <DesktopOutlined />,
// 	},
// ]

// export const itemsAdmin = [
// 	getItem(<div>Quản lý ca</div>, '1', <PieChartOutlined />),
// 	getItem('Quản lí kết nối', '2', '/admin/manage_work', <DesktopOutlined />),
// 	getItem('Nhập sản phẩm', '3', '/admin/products', <PieChartOutlined />),
// 	getItem('Quản lý nhân sự', 'sub1', '', <UserOutlined />, [
// 		getItem('Nhân viên', 'sub1-1', '/admin/manage_employee', <DesktopOutlined />),
// 		getItem('Yêu cầu', 'sub1-2', '/admin/request', <DesktopOutlined />),
// 	]),
// 	getItem('Quản lý đặt bàn', '', 'sub2', <UserOutlined />, [
// 		getItem('Đơn các bàn', '/admin/orders', 'sub2-1', <PieChartOutlined />),
// 	]),
// 	getItem('Căn tin', 'sub3', <TeamOutlined />),
// 	getItem('Thực đơn', 'sub4', <FileOutlined />),
// 	getItem(<div>Bán hàng</div>, 'sub5', <PieChartOutlined />),
// ]

export const itemsAdmin = [
	getItem(<div>Quản lý ca</div>, '1', <PieChartOutlined />),
	getItem(<Link href="/admin/manage_work">Quản lí kết nối</Link>, '2', <DesktopOutlined />),
	getItem(<Link href="/admin/products">Nhập sản phẩm</Link>, '3', <PieChartOutlined />),
	getItem(<Link href="/admin/manage_employee">Quản lý nhân viên</Link>, '4', <DesktopOutlined />),
	getItem('Quản lý đặt bàn', 'sub1', <HelperMenu icon={<UserOutlined />} />, [
		getItem(<Link href="/admin/orders">Đơn các bàn</Link>, 'sub1-1', <PieChartOutlined />),
		getItem(
			<Link href="/admin/request">Yêu cầu</Link>,
			'sub1-2',
			<HelperMenu icon={<PieChartOutlined />} />
		),
	]),
	getItem('Căn tin', 'sub2', <TeamOutlined />, [getItem('Team 1', '9'), getItem('Team 2', '10')]),
	getItem('Thực đơn', '10', <FileOutlined />),
	getItem(<div>Bán hàng</div>, '11', <PieChartOutlined />),
]

export const itemsEmployee = [
	getItem(<Link href="/employee/workshift">Quản lý ca</Link>, '1', <PieChartOutlined />),
	getItem(<Link href="/employee/contact">Quản lý kết nối</Link>, '2', <DesktopOutlined />),
	getItem('Quản lý đặt bàn', 'sub1', <DesktopOutlined />, [
		getItem(<Link href="/employee/order">Đơn tại bàn</Link>, '3', <PieChartOutlined />),
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
