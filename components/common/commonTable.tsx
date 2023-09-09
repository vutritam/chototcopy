import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Menu, Space, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import { FormOutlined, CheckCircleOutlined, IssuesCloseOutlined } from '@ant-design/icons'
import { DropdownItem } from 'semantic-ui-react'
import { updateStatusOrder } from '@/redux/componentSlice/orderSlice'
import { useDispatch } from 'react-redux'

interface DataType {
	key: React.Key
	name: string
	age: number
	address: string
}

interface inputProps {
	handleSubmit?: (itemId: string, flag: boolean) => void
	handleConfirmOrder?: (Id: string) => void
	tittle: string
	item: any
}

const data: DataType[] = []
for (let i = 0; i < 46; i++) {
	data.push({
		key: i,
		name: `Edward King ${i}`,
		age: 32,
		address: `London, Park Lane no. ${i}`,
	})
}

const CommonTable = (props: inputProps): JSX.Element => {
	const { item, handleSubmit, handleConfirmOrder } = props
	const [fixedTop, setFixedTop] = useState(false)
	const [localData, setLocalData] = useState(item)
	const [idItem, setIdItem] = useState(null)
	const [confirmOrder, setConfirmOrder] = useState({ idItem: [], active: false })
	const dispatch = useDispatch()

	useEffect(() => {
		// Cập nhật localData khi data props thay đổi
		setLocalData(item)
	}, [item])
	console.log(localData, 'locadata')

	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log('selectedRowKeys changed: ', newSelectedRowKeys)
		setSelectedRowKeys(newSelectedRowKeys)
	}

	// const handleConfirmOrder = async (id) => {
	// 	const { payload } = await dispatch(updateStatusOrder({ id: id, status: 'order_success' }))
	// }

	useEffect(() => {}, [idItem])

	const items: MenuProps['items'] = [
		{
			key: '1',
			label: (
				<Button type="dashed" onClick={() => handleSubmit(idItem, true)}>
					Hủy bỏ
				</Button>
			),
		},
		{
			key: '2',
			label: (
				<Button type="primary" onClick={() => handleConfirmOrder(idItem)}>
					Xác nhận
				</Button>
			),
		},
	]
	const menu = (
		<Menu>
			{confirmOrder.active && confirmOrder.idItem === item._id ? (
				<CheckCircleOutlined color="red" />
			) : (
				<>
					<Button type="dashed" onClick={() => handleSubmit(item._id, true)}>
						Hủy bỏ
					</Button>
					<Button type="primary" onClick={() => handleConfirmOrder(item._id)}>
						Xác nhận
					</Button>
				</>
			)}
		</Menu>
	)

	const handleStatus = (customData: any) => {
		switch (customData.status) {
			case 'order_success':
				return (
					<Space direction="vertical">
						<Space
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<CheckCircleOutlined style={{ color: '#40cf0e', fontSize: ' 18px' }} />
							<p>Đã xác nhận</p>
						</Space>
					</Space>
				)

			case 'order_failured':
				return (
					<Space direction="vertical">
						<Space
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<IssuesCloseOutlined style={{ color: '#40cf0e', fontSize: ' 18px' }} />
							<p>Thất bại</p>
						</Space>
					</Space>
				)

			default:
				return (
					<Dropdown.Button
						menu={{ items }}
						placement="bottomRight"
						trigger={['click']}
						icon={
							<FormOutlined
								style={{ fontSize: '20px', display: 'flex' }}
								onClick={() => setIdItem(customData._id)}
							/>
						}
					></Dropdown.Button>
				)
		}
	}

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
			dataIndex: 'customData',
			key: 'operation',
			fixed: 'right',
			width: 150,
			// responsive: ['sm'],
			render: (customData) => handleStatus(customData),
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

	const localDataWithCustomData = localData.map((record) => ({
		...record,
		customData: { status: record.status, _id: record._id },
	}))

	return (
		<Table
			columns={columns}
			dataSource={localDataWithCustomData}
			scroll={{ x: 1000 }}
			rowSelection={{ ...rowSelection }}
			sticky
		/>
	)
}

export default CommonTable
