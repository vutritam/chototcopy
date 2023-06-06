import React, { useEffect, useState } from 'react'
import { Breadcrumb, Layout, theme } from 'antd'
import { SideBar } from '../siderBar/siderBar'
const { Header, Content, Footer } = Layout
import AvatarComponent from '../avatar/avatar'
import { useRouter } from 'next/router'
import ComfirmLocationOrder from '../common/confirmLocation'

type MyComponentProps = {
	children: React.ReactNode
	itemsSiderBar: React.ReactNode
}
const MasterLayout: React.FC<MyComponentProps> = ({
	children,
	itemsSiderBar,
}: MyComponentProps) => {
	const router = useRouter()
	const [collapsed, setCollapsed] = useState(false)
	const [openShowConfirmLocation, setShowConfirmLocation] = useState(false)
	const {
		token: { colorBgContainer },
	} = theme.useToken()
	const isOrderPage = router.pathname.startsWith('/order')
	useEffect(() => {
		isOrderPage ? setShowConfirmLocation(true) : setShowConfirmLocation(false)
	}, [])
	return (
		<Layout style={{ minHeight: '100vh' }}>
			{!openShowConfirmLocation ? (
				<ComfirmLocationOrder open={openShowConfirmLocation} tittle="Xác nhận vị trí!" />
			) : (
				''
			)}
			<SideBar collapsed={collapsed} items={itemsSiderBar} />
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
						}}
					>
						{children}
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>Bản quyền thuộc team GOLD COFFEE</Footer>
			</Layout>
		</Layout>
	)
}

export default MasterLayout
