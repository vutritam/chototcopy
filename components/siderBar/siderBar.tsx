import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout, Menu, Image, MenuProps } from 'antd'
const { Sider } = Layout
import { useRouter } from 'next/router'

interface items {
	collapsed: boolean
	items: any
	handleChangeComponent?: any
	selectedItemKey?: any
	handleMenuClick?: any
	handleClickCollapse: any
	isPage?: string
	className?: string
}

export function SideBar(props: items) {
	const { collapsed, handleClickCollapse, className } = props
	const [currentURL, setcurrentURL] = useState('/')
	const router = useRouter()
	const getKeyActived = sessionStorage.getItem('clickItemChecked')

	useEffect(() => {
		// Kiểm tra xem code đang chạy trên môi trường server (Node.js) hay client (trình duyệt)
		if (typeof window !== 'undefined') {
			// Lấy toàn bộ URL
			const currentURLChange = window.location.href
			setcurrentURL(currentURLChange)
		}
	}, [router])

	return (
		<Sider
			collapsible
			collapsed={collapsed}
			className={className}
			onCollapse={(value) => handleClickCollapse(value)}
			mode={'inline'}
			theme={'light'}
			style={{
				overflow: 'auto',
				height: '100vh',
				position: 'fixed',
				left: 0,
				top: 0,
				bottom: 0,
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
					<Link href={window.location.pathname} style={{ color: 'blue' }}>
						<b>GOLD COFFE</b>
					</Link>
				) : (
					''
				)}
			</div>
			<Menu
				mode={'inline'}
				theme={'light'}
				onClick={props.handleMenuClick}
				selectedKeys={[getKeyActived == null ? '1' : getKeyActived]}
				defaultSelectedKeys={['1']}
				items={props.items}
			/>
		</Sider>
	)
}
