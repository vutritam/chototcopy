import React, { useEffect, useState } from 'react'
import { Breadcrumb, Layout, Space, Spin, theme } from 'antd'
import { SideBar } from '../siderBar/siderBar'
const { Header, Content, Footer } = Layout
import AvatarComponent from '../avatar/avatar'
import { useRouter } from 'next/router'
import ComfirmLocationOrder from '../common/confirmLocation'

type MyComponentProps = {
	children: React.ReactNode
	itemsSiderBar: React.ReactNode
	selectedItemKey: any
	handleMenuClick?: any
	isPage: string
}
const MasterLayout: React.FC<MyComponentProps> = ({
	children,
	itemsSiderBar,
	selectedItemKey,
	handleMenuClick,
	isPage,
}: MyComponentProps) => {
	const router = useRouter()
	const [collapsed, setCollapsed] = useState(false)
	const [triggerWidthSiderBar, setTriggerWidth] = useState(0)
	const [openShowConfirmLocation, setShowConfirmLocation] = useState(false)
	const [loading, setLoading] = useState(false)
	const {
		token: { colorBgContainer },
	} = theme.useToken()
	const isOrderPage = router.pathname.startsWith('/order')
	useEffect(() => {
		isOrderPage ? setShowConfirmLocation(true) : setShowConfirmLocation(false)
		setLoading(true)
		setTimeout(() => {
			setLoading(false)
		}, 1000)
	}, [router.asPath])

	useEffect(() => {
		if (collapsed) {
			setTriggerWidth(80)
		}
	}, [collapsed])
	const handleClickCollapse = (value: boolean) => {
		setCollapsed(value)
	}

	return (
		<Layout style={{ minHeight: '100vh', marginLeft: collapsed ? triggerWidthSiderBar : 200 }}>
			{!openShowConfirmLocation ? (
				<ComfirmLocationOrder open={openShowConfirmLocation} tittle="Xác nhận vị trí!" />
			) : (
				''
			)}
			<SideBar
				collapsed={collapsed}
				isPage={isPage}
				handleClickCollapse={handleClickCollapse}
				items={itemsSiderBar}
				selectedItemKey={selectedItemKey}
				handleMenuClick={handleMenuClick}
			/>
			<Layout className="site-layout">
				<Header
					style={{
						paddingRight: 10,
						background: 'white',
						position: 'sticky',
						top: 0,
						zIndex: 1,
						width: '100%',
					}}
				>
					<AvatarComponent />
				</Header>
				<Content style={{ margin: '0 16px' }}>
					<Breadcrumb style={{ margin: '16px 0' }}>
						<Breadcrumb.Item>User</Breadcrumb.Item>
						<Breadcrumb.Item>Quản lí ca</Breadcrumb.Item>
					</Breadcrumb>
					<div
						style={{
							position: 'relative',
							padding: 24,
							// maxHeight: 560,
							background: colorBgContainer,
							// overflow: 'auto',
						}}
					>
						{!loading ? (
							children
						) : (
							<Space
								style={{
									// textAlign: 'center',
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									height: '300px',
								}}
							>
								<Spin tip="Loading..."></Spin>
							</Space>
						)}
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>Bản quyền thuộc team GOLD COFFEE</Footer>
			</Layout>
		</Layout>
	)
}

export default MasterLayout
