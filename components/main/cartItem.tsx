import React, { useState } from 'react'
import { Button, Drawer, Space, Tooltip } from 'antd'
import ListUser from './listUser'
import Link from 'next/link'
import {
	ShoppingCartOutlined,
	MenuUnfoldOutlined,
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { MenuProps, Menu } from 'antd'
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
const CartItem: React.FC = (props) => {
	const { className } = props
	const [open, setOpen] = useState(false)

	const itemsOrder: MenuItem[] = [
		getItem(
			<Link href={typeof window !== 'undefined' && window.location.pathname}>Thực đơn</Link>,
			'1',
			<DesktopOutlined />
		),
		getItem('Khuyến mãi', 'sub2', <TeamOutlined />, [
			getItem('Team 1', '2'),
			getItem('Team 2', '3'),
		]),
		getItem('Ăn vặt', 'sub3', <TeamOutlined />, [getItem('Team 1', '4'), getItem('Team 2', '5')]),
	]
	const showDrawer = () => {
		setOpen(true)
	}

	const onClose = () => {
		setOpen(false)
	}

	return (
		<>
			<Tooltip title="Bạn có 23 sản phẩm" color={'red'} key={'red'}>
				{className ? (
					<MenuUnfoldOutlined
						style={{ fontSize: '22px', width: '30px', display: 'flex' }}
						onClick={showDrawer}
					/>
				) : (
					<ShoppingCartOutlined
						style={{ fontSize: '22px', width: '30px', display: 'flex' }}
						onClick={showDrawer}
					/>
				)}
			</Tooltip>

			<Drawer
				title={
					!className ? 'Thông tin giỏ hàng (23)' : <b style={{ color: 'blue' }}>GOLD COFFEE</b>
				}
				placement="right"
				onClose={onClose}
				open={open}
			>
				<Space direction="vertical" style={{ width: '100%' }}>
					{className ? (
						<Menu
							mode={'inline'}
							theme={'light'}
							// onClick={props.handleMenuClick}
							// selectedKeys={[props.selectedItemKey]}
							// defaultSelectedKeys={[getKeyActived]}
							items={itemsOrder}
						/>
					) : (
						<div>
							<div>
								<ListUser />
							</div>

							<div className="">
								<div className="flex-box">
									<h2>Tổng tiền</h2>
									<p>12.000.000 Đ</p>
								</div>
								<Button type="primary" block>
									Thanh toán
								</Button>
							</div>
						</div>
					)}
				</Space>
			</Drawer>
		</>
	)
}

export default CartItem
