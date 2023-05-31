import { useState } from 'react'
import Link from 'next/link'
import { Layout, Menu, Image } from 'antd'
const { Sider } = Layout

interface items {
	collapsed: boolean
	items: any
	handleChangeComponent?: any
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
				<Image src="/images/Logo.png" width={collapsed ? 40 : 20} height={collapsed ? 40 : 20} />
				{!collapsed ? (
					<Link href="/admin" style={{ color: 'white' }}>
						GOLD COFFE
					</Link>
				) : (
					''
				)}
			</div>
			<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={props.items} />
		</Sider>
	)
}
