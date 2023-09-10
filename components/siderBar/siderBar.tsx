import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout, Menu, Image } from 'antd'
const { Sider } = Layout
import { useRouter } from 'next/router'

interface items {
	collapsed: boolean
	items: any
	handleChangeComponent?: any
	selectedItemKey?: any
	handleMenuClick?: any
}

export function SideBar(props: items) {
	const [collapsed, setCollapsed] = useState(false)
	const [currentURL, setcurrentURL] = useState('/')
	const router = useRouter()
	useEffect(() => {
		// Kiểm tra xem code đang chạy trên môi trường server (Node.js) hay client (trình duyệt)
		if (typeof window !== 'undefined') {
			// Lấy toàn bộ URL
			const currentURLChange = window.location.href
			setcurrentURL(currentURLChange)
			// console.log(currentURL, 'currentURL') // In ra URL trong console hoặc sử dụng URL theo nhu cầu của bạn
		}
	}, [router])

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
			<Menu
				onClick={props.handleMenuClick}
				theme="dark"
				// selectedKeys={[props.selectedItemKey]}
				defaultSelectedKeys={[props.selectedItemKey]}
				mode="inline"
				items={props.items}
			/>
		</Sider>
	)
}
