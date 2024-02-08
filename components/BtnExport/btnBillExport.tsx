import React from 'react'
import type { MenuProps } from 'antd'
import { Button, Dropdown } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const BillExport: React.FC = (props) => {
	const { showDrawer, items } = props
	const itemAllOrder = useSelector((state: any) => state.dataOrder?.dataAllOrder?.data)
	const itemsShowBill: MenuProps['items'] = [
		{
			key: '1',
			label: <p onClick={() => showDrawer('billNormal')}>Hóa đơn thường</p>,
		},
		{
			key: '2',
			label: <p onClick={() => showDrawer('billRed')}>Hóa đơn đỏ</p>,
		},
	]
	const dataCustomItem =
		itemAllOrder !== null && typeof itemAllOrder === 'object' && !Array.isArray(itemAllOrder)
			? itemAllOrder.data
			: itemAllOrder
	const isHasItemConfirmed = dataCustomItem?.some(
		(item) => item.status === 'order_success' || (item.status === 'order_done' && !item.isPaid)
	)

	return (
		<>
			{isHasItemConfirmed ? (
				<Dropdown menu={{ items: itemsShowBill }} placement="bottom" arrow>
					<Button style={{ marginBottom: '20px' }}>
						<FileTextOutlined />
						Xuất hóa đơn
					</Button>
				</Dropdown>
			) : (
				<Button style={{ marginBottom: '20px' }} disabled={isHasItemConfirmed ? false : true}>
					<FileTextOutlined />
					Xuất hóa đơn
				</Button>
			)}
			{isHasItemConfirmed ? (
				<Dropdown menu={{ items }} placement="bottom" arrow>
					<Button style={{ marginLeft: '5px' }}>
						<FileTextOutlined />
						Xác nhận thanh toán
					</Button>
				</Dropdown>
			) : null}
		</>
	)
}

export default BillExport
