import React, { useState } from 'react'
import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
	AudioOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme, Input } from 'antd'
import { SideBar } from './component/siderBar/siderBar'
import AvatarComponent from './component/avatar/avatar'
import ListItem from './component/main/listItem'
import { useRouter } from 'next/router'
import ManageWork from './component/main/manageWork'
import Link from 'next/link'

const { Header, Content, Footer, Sider } = Layout

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

const App: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false)
	const {
		token: { colorBgContainer },
	} = theme.useToken()
	const router = useRouter()
	const [currentComponent, setCurrentComponent] = React.useState('listItem')

	const handleChangeComponent = (component: string) => {
		setCurrentComponent(component)
		// router.push(`${component}`)
	}
	const items: MenuItem[] = [
		getItem(
			<div onClick={() => handleChangeComponent('/admin/manage-work')}>Quản lý ca</div>,
			'1',
			<PieChartOutlined />
		),
		getItem('Quản lý kết nối', '2', <DesktopOutlined />),
		getItem('Quản lý đặt bàn', 'sub1', <UserOutlined />, [
			getItem('Tom', '3'),
			getItem('Bill', '4'),
			getItem('Alex', '5'),
		]),
		getItem('Căn tin', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
		getItem('Thực đơn', '9', <FileOutlined />),
	]
	let renderedComponent = null
	switch (currentComponent) {
		case '/admin/listItem':
			renderedComponent = <ListItem />
			break
		case '/admin/manage-work':
			renderedComponent = <ManageWork />
			break
		// case 'anotherComponent':
		// 	renderedComponent = <AnotherComponent />
		// 	break
		// Xử lý cho các component khác tùy theo số lượng và tên của chúng
		default:
			renderedComponent = <ListItem />
			break
	}

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<SideBar collapsed={collapsed} items={items} handleChangeComponent={handleChangeComponent} />
			<Layout className="site-layout">
				<Header style={{ paddingRight: 10, background: 'white' }}>
					<AvatarComponent />
				</Header>
				<Content style={{ margin: '0 16px' }}>
					<Breadcrumb style={{ margin: '16px 0' }}>
						<Breadcrumb.Item>User</Breadcrumb.Item>
						<Breadcrumb.Item>Quản lí ca</Breadcrumb.Item>
					</Breadcrumb>
					<div
						style={{
							padding: 24,
							minHeight: 360,
							background: colorBgContainer,
							// overflowY: 'scroll',
							// height: '100vh',
						}}
					>
						{renderedComponent}
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>Bản quyền thuộc team GOLD COFFEE</Footer>
			</Layout>
		</Layout>
	)
}

export default App
