import React, { useEffect, useRef, useState } from 'react'
import { Button, Dropdown, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import { FormOutlined, CheckCircleOutlined, IssuesCloseOutlined } from '@ant-design/icons'
import { sortByLatestDate } from '../helper/helper'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
// import { DropdownItem } from 'semantic-ui-react'
// import { updateStatusOrder } from '@/redux/componentSlice/orderSlice'
// import { useDispatch } from 'react-redux'

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
	// item: any
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
	const { handleSubmit, handleConfirmOrder } = props
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const item = useSelector((state: any) => state.dataOrder?.dataOrderByNumberTable?.data)

	// const [fixedTop, setFixedTop] = useState(false)
	const [localData, setLocalData] = useState(null)
	const [idItem, setIdItem] = useState(null)
	// const [confirmOrder, setConfirmOrder] = useState({ idItem: [], active: false })
	// const dispatch = useDispatch()
	const [checkHeighTd, setCheckHeighTd] = useState(0)
	const [showRedBackground, setShowRedBackground] = useState(false)
	// const [latestDateRecordId, setLatestDateRecordId] = useState(null)
	// const tableRef = useRef()
	useEffect(() => {
		// Cập nhật localData khi data props thay đổi
		// const checkTd = localData.reduce((count, item) => {
		// 	return count + 1
		// }, 0)
		// const countPx = checkTd * 73

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
		setLocalData(localDataWithCustomData)
		// setCheckHeighTd(countPx)

		setShowRedBackground(true)
		const timer = setTimeout(() => {
			setShowRedBackground(false)
		}, 2000)

		return () => clearTimeout(timer) // Hủy bỏ timer khi component unmounts hoặc timer được clear
	}, [item])
	// console.log(item, 'localData')
	useEffect(() => {
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

		// Cập nhật state để giữ record có ngày mới nhất
		setLocalData(localDataWithCustomData)
	}, [])

	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys)
	}

	// const handleConfirmOrder = async (id) => {
	// 	const { payload } = await dispatch(updateStatusOrder({ id: id, status: 'order_success' }))
	// }

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
	// const menu = (
	// 	<Menu>
	// 		{confirmOrder.active && confirmOrder.idItem === item._id ? (
	// 			<CheckCircleOutlined color="red" />
	// 		) : (
	// 			<>
	// 				<Button type="dashed" onClick={() => handleSubmit(item._id, true)}>
	// 					Hủy bỏ
	// 				</Button>
	// 				<Button type="primary" onClick={() => handleConfirmOrder(item._id)}>
	// 					Xác nhận
	// 				</Button>
	// 			</>
	// 		)}
	// 	</Menu>
	// )

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
			case 'order_deleted':
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

			default:
				return (
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
			dataIndex: 'customData',
			key: 'location',
			// fixed: 'left',
			sorter: true,
			render: (customData) => (
				<div
					className={`${customData?.status === 'order_deleted' ? 'text-error-message' : ''}`}
					style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
				>
					{customData?.location}
				</div>
			),
			// responsive: ['sm'],
		},
		{
			title: 'Tên món',
			dataIndex: 'customData',
			key: 'productId',
			// fixed: 'left',
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
			// responsive: ['sm'],
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			width: 120,
			// fixed: 'left',
			sorter: true,
		},

		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
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

	// useEffect(() => {
	// 	function handleScrollEvent() {
	// 		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
	// 			console.log("you're at the bottom of the page")
	// 			// here add more items in the 'filteredData' state from the 'allData' state source.
	// 		}
	// 	}

	// 	window.addEventListener('scroll', handleScrollEvent)

	// 	return () => {
	// 		window.removeEventListener('scroll', handleScrollEvent)
	// 	}
	// }, [])
	// useEffect(() => {

	// },[])
	// console.log(checkHeighTd > 365 ? checkHeighTd : 365, 'check')
	// console.log(localDataWithCustomData.length, 'ô')
	// const handleRowInit = (record, index) => {
	// 	// Nếu ô được khởi tạo là ô đầu tiên
	// 	console.log('vào', index)

	// 	if (index === 0) {
	// 		// Thay đổi màu background ô
	// 		record.style.backgroundColor = 'red'
	// 	}
	// }
	// const rowRender = (record, index) => {
	// 	console.log(record, 'record')

	// 	// Nếu ô là ô đầu tiên
	// 	if (index === 0) {
	// 		// Thay đổi màu background ô
	// 		return (
	// 			<tr style={{ backgroundColor: 'red' }}>
	// 				<td>{record.tableNumber}</td>
	// 				<td>{record.location}</td>
	// 				<td>{record.customData.productId && record.customData.productId.name}</td>
	// 				{/* <td>{record.customData.productId && record.customData.productId.name}</td> */}
	// 			</tr>
	// 		)
	// 	}
	// 	return (
	// 		<tr>
	// 			<td>{record.id}</td>
	// 			<td>{record.name}</td>
	// 			<td>{record.age}</td>
	// 		</tr>
	// 	)
	// }
	// console.log(latestDateRecordId, 'latestDateRecordId')

	return (
		<div>
			<Table
				columns={columns}
				rowKey="_id"
				virtual={true}
				dataSource={localData}
				// loading={localData?.length > 0 ? false : true}
				scroll={{ x: 1000, y: 300 }}
				rowSelection={{ ...rowSelection }}
				pagination={false}
				sticky
				onRow={(record, index) => ({
					style: {
						background: showRedBackground && index === 0 ? '#92d7e7' : '',
					},
				})}

				// onRow={rowRender}
			/>
		</div>
	)
}

export default React.memo(CommonTable)
