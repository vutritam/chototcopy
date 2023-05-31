import React, { useState } from 'react'
import { Button, Drawer, Space, Tooltip } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import ListUser from './listUser'
const CartItem: React.FC = () => {
	const [open, setOpen] = useState(false)

	const showDrawer = () => {
		setOpen(true)
	}

	const onClose = () => {
		setOpen(false)
	}

	return (
		<>
			<Tooltip title="Bạn có 23 sản phẩm" color={'red'} key={'red'}>
				<ShoppingCartOutlined
					style={{ fontSize: '22px', width: '30px', display: 'flex' }}
					onClick={showDrawer}
				/>
			</Tooltip>

			<Drawer title="Thông tin giỏ hàng (23)" placement="right" onClose={onClose} open={open}>
				<Space direction="vertical" style={{ width: '100%' }}>
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
				</Space>
			</Drawer>
		</>
	)
}

export default CartItem
