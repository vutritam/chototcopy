import React from 'react'
import type { MenuProps } from 'antd'
import { Button, Dropdown } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const BillExport: React.FC = (props) => {
	const { showDrawer } = props
	const list = useSelector((state: any) => state.dataOrder?.dataOrderByNumberTable?.data)
	const items: MenuProps['items'] = [
		{
			key: '1',
			label: <p onClick={() => showDrawer('billNormal')}>Hóa đơn thường</p>,
		},
		{
			key: '2',
			label: <p onClick={() => showDrawer('billRed')}>Hóa đơn đỏ</p>,
		},
	]

	return (
		<>
			<Dropdown menu={{ items }} placement="bottom" arrow>
				<Button style={{ marginBottom: '20px' }}>
					<FileTextOutlined />
					Xuất hóa đơn
				</Button>
			</Dropdown>
		</>
	)
}

export default BillExport
