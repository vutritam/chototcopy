// import ListItem from '@/components/main/listItem'
// import ManageMoney from '@/components/main/manageMoney'
import { Dropdown, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useState } from 'react'
// import ListItem from './listItem'
// import ManageMoney fro'

type Props = {}
interface DataType {
	key: React.Key
	name: string
	age: number
	address: string
}
export default function ManageWork({}: Props) {
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		// console.log('selectedRowKeys changed: ', newSelectedRowKeys)
		setSelectedRowKeys(newSelectedRowKeys)
	}
	// const onChange = (key: string) => {
	// 	// console.log(key)
	// }
	const columns: ColumnsType<DataType> = [
		{
			title: 'Số bàn',
			dataIndex: 'tableNumber',
			key: 'tableNumber',
			fixed: 'left',
			sorter: true,
			width: 100,
			// responsive: ['sm'],
		},
		{
			title: 'Địa điểm',
			dataIndex: 'location',
			key: 'location',
			// fixed: 'left',
			sorter: true,
			// responsive: ['sm'],
		},
		{
			title: 'Tên món',
			dataIndex: 'productId',
			key: 'productId',
			// fixed: 'left',
			sorter: true,
			render: (productId) => (
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div>
						{' '}
						<Tag color={'green'}>{productId.name.toUpperCase()}</Tag>
					</div>
					<img
						width={40}
						height={40}
						style={{ borderRadius: '50px' }}
						alt="logo"
						src={`http://localhost:3000/images/${productId.file}`}
					/>
				</div>
			),
			// responsive: ['sm'],
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			width: 150,
			// fixed: 'left',
			sorter: true,
		},
		{
			title: 'Action',
			dataIndex: '_id',
			key: 'operation',
			fixed: 'right',
			width: 100,
			// responsive: ['sm'],
			render: (_id) => (
				<Space direction="vertical">
					<Dropdown.Button
						// menu={{ items }}
						placement="bottomRight"
						trigger={['click']}
						// icon={
						// 	<FormOutlined
						// 		style={{ fontSize: '20px', display: 'flex' }}
						// 		onClick={() => setIdItem(_id)}
						// 	/>
						// }
					></Dropdown.Button>
				</Space>
			),
		},
	]
	const rowSelection: TableRowSelection<DataType> = {
		selectedRowKeys,
		onChange: onSelectChange,
		selections: [
			Table.SELECTION_ALL,
			Table.SELECTION_INVERT,
			Table.SELECTION_NONE,
			{
				key: 'odd',
				text: 'Select Odd Row',
				onSelect: (changeableRowKeys) => {
					let newSelectedRowKeys = []
					newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
						if (index % 2 !== 0) {
							return false
						}
						return true
					})
					setSelectedRowKeys(newSelectedRowKeys)
				},
			},
			{
				key: 'even',
				text: 'Select Even Row',
				onSelect: (changeableRowKeys) => {
					let newSelectedRowKeys = []
					newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
						if (index % 2 !== 0) {
							return true
						}
						return false
					})
					setSelectedRowKeys(newSelectedRowKeys)
				},
			},
		],
	}
	return (
		<div>
			<Table
				columns={columns}
				// dataSource={localData}
				scroll={{ x: 1000 }}
				rowSelection={{ ...rowSelection }}
				sticky
			/>
		</div>
	)
}
