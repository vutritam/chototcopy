import { useState } from 'react'
import { Layout, Menu, Image } from 'antd'
const { Sider } = Layout
import type { MenuProps } from 'antd'
import logo from '../../../../public/images/Logo.png'
type MenuItem = Required<MenuProps>['items'][number]

interface items {
	collapsed: boolean
	items: any
	handleChangeComponent: any
}

export function SideBar(props: items) {
	const [collapsed, setCollapsed] = useState(false)
	return (
		<Sider
			collapsible
			collapsed={collapsed}
			onCollapse={(value) => setCollapsed(value)}
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 10,
			}}
		>
			<div
				style={{
					height: 32,
					margin: 16,
					width: 200,
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
				}}
			>
				<Image width={20} height={20} fallback="" />
				<a style={{ color: 'white' }}>GOLD COFFE</a>
			</div>
			<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={props.items} />
		</Sider>
	)
}
