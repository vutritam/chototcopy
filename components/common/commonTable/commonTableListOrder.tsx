import React, { useEffect, useState } from 'react'
import { Button, Dropdown, MenuProps, Space, Table, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import { FormOutlined, CheckCircleOutlined, IssuesCloseOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'

interface DataType {
	key: React.Key
	name: string
	age: number
	address: string
}

interface inputProps {
	handleSubmit?: (itemId: any, flag: boolean) => void
	handleConfirmOrder?: (Id: any) => void
	tittle: string
	item: any
	loadingDataTable?: boolean
	dummyOrderConfirm?: any
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
	const { handleSubmit, handleConfirmOrder, item, loadingDataTable, dummyOrderConfirm } = props
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()
	const isEmployeePage = router.pathname.startsWith('/employee')
	const [localData, setLocalData] = useState(null)
	const [idItem, setIdItem] = useState(null)

	const [showRedBackground, setShowRedBackground] = useState(false)

	useEffect(() => {
		// Cập nhật localData khi data props thay đổi
		const localDataWithCustomData =
			item !== null && typeof item === 'object' && !Array.isArray(item)
				? item?.data?.map((record: any) => ({
						...record,
						customData: {
							tableNumber: record.tableNumber,
							status: record.status,
							_id: record._id,
							location: record.location,
							productId: record.productId,
						},
				  }))
				: item?.map((record: any) => ({
						...record,
						customData: {
							tableNumber: record.tableNumber,
							status: record.status,
							_id: record._id,
							location: record.location,
							productId: record.productId,
						},
				  }))

		const filterLocalDataWithCustomData = localDataWithCustomData?.filter((record: any) =>
			isEmployeePage ? record.status !== 'order_deleted' : record
		)
		setLocalData(filterLocalDataWithCustomData)
		setShowRedBackground(true)
		const timer = setTimeout(() => {
			setShowRedBackground(false)
		}, 2000)

		return () => clearTimeout(timer) // Hủy bỏ timer khi component unmounts hoặc timer được clear
	}, [item])

	// useEffect(() => {
	// 	const localDataWithCustomData =
	// 		item !== null && typeof item === 'object' && !Array.isArray(item)
	// 			? item?.data?.map((record: any) => ({
	// 					...record,
	// 					customData: {
	// 						tableNumber: record.tableNumber,
	// 						status: record.status,
	// 						_id: record._id,
	// 						location: record.location,
	// 						productId: record.productId,
	// 					},
	// 			  }))
	// 			: item?.map((record: any) => ({
	// 					...record,
	// 					customData: {
	// 						tableNumber: record.tableNumber,
	// 						status: record.status,
	// 						_id: record._id,
	// 						location: record.location,
	// 						productId: record.productId,
	// 					},
	// 			  }))

	// 	// Cập nhật state để giữ record có ngày mới nhất
	// 	setLocalData(localDataWithCustomData)
	// }, [])

	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys)
	}

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

	const handleStatus = (customData: any) => {
		const checkConfirmOrder = dummyOrderConfirm.filter((item) => item.id === customData._id)
		if (customData.status === 'order_success' || checkConfirmOrder.length > 0) {
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
		} else if (customData.status === 'order_failured') {
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
		} else if (customData.status === 'order_deleted') {
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
						<IssuesCloseOutlined style={{ color: 'rgb(255 0 21)', fontSize: ' 18px' }} />
						<p>Đã hủy</p>
					</Space>
				</Space>
			)
		} else {
			return isEmployeePage ? (
				<Dropdown.Button
					menu={{ items }}
					placement="bottomRight"
					trigger={['click']}
					icon={
						<FormOutlined
							style={{ fontSize: '20px', display: 'flex' }}
							onClick={() => setIdItem(customData)}
						/>
					}
				></Dropdown.Button>
			) : (
				'Đang chờ nhân viên'
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
		},
		{
			title: 'Địa điểm',
			dataIndex: 'customData',
			key: 'location',
			sorter: true,
			render: (customData) => (
				<div
					className={`${customData?.status === 'order_deleted' ? 'text-error-message' : ''}`}
					style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
				>
					{customData?.location}
				</div>
			),
		},
		{
			title: 'Tên món',
			dataIndex: 'customData',
			key: 'productId',
			sorter: true,
			render: (customData) => (
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div>
						{' '}
						<Tag color={customData?.status === 'order_deleted' ? 'red' : 'green'}>
							{customData?.productId?.name.toUpperCase()}
						</Tag>
					</div>
					<img
						width={40}
						height={40}
						style={{ borderRadius: '50px' }}
						alt="logo"
						src={`http://localhost:3000/images/${customData?.productId?.file}`}
					/>
				</div>
			),
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			width: 100,
			sorter: true,
		},

		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			width: 170,
			sorter: true,
			render: (text, record) => (
				<Tooltip placement="top" title={text} key={'red'}>
					<div className="text-norwap">{text || 'N/A'}</div>
				</Tooltip>
			),
		},
		{
			title: 'Action',
			dataIndex: 'customData',
			key: 'operation',
			fixed: 'right',
			width: 180,
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

	return (
		<div>
			<Table
				columns={columns}
				rowKey="_id"
				virtual={true}
				dataSource={localData}
				loading={loadingDataTable}
				rowSelection={{ ...rowSelection }}
				pagination={{
					onChange: (page) => {
						console.log(page)
					},
					pageSize: 5,
				}}
				sticky
				onRow={(record, index) => ({
					style: {
						background: showRedBackground && index === 0 ? '#92d7e7' : '',
					},
				})}
			/>
		</div>
	)
}

export default React.memo(CommonTable)