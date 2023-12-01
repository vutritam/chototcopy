import React, { useEffect, useState } from 'react'
import { Button, Spin } from 'antd'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import {
	deleteAllRecordOrder,
	deleteOrder,
	fetchAllOrderByUserRole,
	setOrderByNumberTable,
	updateStatusOrder,
} from '@/redux/componentSlice/orderSlice'
import Toasty from '@/components/common/toasty'
import ModalConfirm from '@/components/common/modalConfirm'
import CommonTable from '@/components/common/commonTable'
import { LoadingOutlined } from '@ant-design/icons'
import { deleteAllRecordNotification } from '@/redux/componentSlice/messageSocketSlice'

interface DataType {
	gender?: string
	name: {
		title?: string
		first?: string
		last?: string
	}
	email?: string
	picture: {
		large?: string
		medium?: string
		thumbnail?: string
	}
	nat?: string
	loading: boolean
}

// const count = 3

const OrderByUser: React.FC = () => {
	const [initLoading, setInitLoading] = useState(true)
	const [open, setOpen] = useState(false)
	// const dataList = useSelector((state: any) => state.dataOrder?.dataOrder?.data)
	const dispatch = useDispatch()
	// const [loading, setLoading] = useState(false)
	const [idOrder, setIdOrder] = useState(null)
	const [data, setData] = useState<DataType[]>([])
	const [list, setList] = useState<DataType[]>([])
	const [socket, setSocket] = useState(null)
	const [refreshPage, setRefresh] = useState(false)
	const [countOrderDoNotComfirm, setCountOrderDontConfirm] = useState(0)

	const getLocationEmployee =
		sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))

	// let getLocationEmployee = JSON.parse(sessionStorage.getItem('user') || '')
	// const [currentPage, setCurrentPage] = useState(1)
	let pageSize = 5
	// const [startIndex, setStartIndex] = useState(0)
	// const [endIndex, setEndIndex] = useState(pageSize - 1)
	// useEffect(() => {}, [])
	useEffect(() => {
		// setInitLoading(true)
		const ENV_HOST = process.env.NEXT_PUBLIC_HOST
		const newSocket = io(ENV_HOST)
		setSocket(newSocket)

		// Fetch dữ liệu ban đầu và cập nhật state
		const fetchData = async () => {
			const { payload } = await dispatch(
				fetchAllOrderByUserRole({
					location: getLocationEmployee?.data?.location,
					userRole: getLocationEmployee?.data?.roles[0],
				})
			)
			if (payload?.success) {
				let filterOrderDoNotComfirm = payload.data.reduce(
					(accumulator, currentValue) => {
						if (currentValue.status === 'order_success') {
							return accumulator + 1
						}
						return accumulator
					},

					0
				)
				setCountOrderDontConfirm(filterOrderDoNotComfirm)
				setInitLoading(false)
				await dispatch(setOrderByNumberTable(payload.data))
				setData(payload.data)
				setList(payload.data)
				setRefresh(false)
			}
			// Toasty.error(payload?.message)
			setInitLoading(false)
		}

		fetchData()

		return () => {
			newSocket.disconnect()
		}
	}, [refreshPage])

	useEffect(() => {
		if (socket) {
			socket.emit('joinRoom', 'room')
			socket.on('resProductOrder', async (response) => {
				let item = response.data?.find((item) => item?.location)
				console.log(response, 'resProductOrder')

				if (item?.location === getLocationEmployee?.data?.location) {
					setList(response.data)
					await dispatch(setOrderByNumberTable(response.data))
					setData(response.data)
				}
			})
			// socket.on('resAllOrderByStatus', async (response) => {
			// 	console.log(response, 'resAllOrderByStatus')
			// })
		}
	}, [socket])

	// const onLoadMore = (page) => {
	// 	// console.log(page, 'page')

	// 	setLoading(true)
	// 	setCurrentPage(page)
	// 	const newStartIndex = (page - 1) * pageSize
	// 	const newEndIndex = newStartIndex + pageSize - 1
	// 	const items = list.slice(startIndex, endIndex + 1)
	// 	// const dataInit = [...list]
	// 	setStartIndex(newStartIndex)
	// 	setEndIndex(newEndIndex)
	// 	if (page !== 1) {
	// 		setList(items)
	// 		return
	// 	}
	// 	setList(data)
	// }

	const handleConfirmOrder = async (id) => {
		if (socket) {
			// gửi sự kiện get sản phẩm
			socket.emit('getAllOrderByStatus', { tableNumber: id.tableNumber, location: id.location })
		}
		await dispatch(updateStatusOrder({ id: id._id, status: 'order_success' }))
	}

	const handleDeleteItem = async () => {
		const { payload } = await dispatch(
			deleteOrder({
				id: idOrder,
				location: getLocationEmployee?.data?.location,
				status: 'order_deleted',
			})
		)
		if (payload?.success) {
			setList(payload.data)
			setData(payload.data)
			// setRefresh(false)
		}
		Toasty.success(payload?.message)
	}

	const handleDeleteAllRecord = async () => {
		const { payload } = await dispatch(deleteAllRecordOrder())
		Toasty.success(payload?.message)
	}

	const handleDeleteAllRecordNotification = async () => {
		const { payload } = await dispatch(deleteAllRecordNotification())
		Toasty.success(payload?.message)
	}

	const handleConfirmDelete = (id, showModal) => {
		setOpen(showModal)
		setIdOrder(id)
	}

	// const loadMore =
	// 	!initLoading && !loading ? (
	// 		<div
	// 			style={{
	// 				textAlign: 'right',
	// 				marginTop: 12,
	// 				height: 32,
	// 				lineHeight: '32px',
	// 			}}
	// 		>
	// 			{/* <Affix offsetBottom={150}> */}
	// 			<Button onClick={onLoadMore} type="primary">
	// 				loading more
	// 			</Button>
	// 			{/* </Affix> */}
	// 		</div>
	// 	) : null

	return (
		<>
			<ModalConfirm
				label=""
				title="Xác nhận xóa item này ?"
				position="renderConfirmDeleteItemOrder"
				open={open}
				setOpen={setOpen}
				handleSubmit={handleDeleteItem}
				size={500}
			/>
			<div
				style={{
					width: '100%',
					display: 'flex',
					gap: '10px',
					justifyContent: 'flex-end',
					marginBottom: '30px',
				}}
			>
				<Button type="primary" onClick={() => setRefresh(true)}>
					Refresh
				</Button>
				<Button type="default" onClick={() => handleDeleteAllRecord()}>
					Delete All
				</Button>
				<Button type="default" onClick={() => handleDeleteAllRecordNotification()}>
					Delete All Notification
				</Button>
			</div>
			{/* <h3>
				Số đơn đã xác nhận:{' '}
				{countOrderDoNotComfirm > 0 ? (
					<span style={{ color: 'green' }}>{countOrderDoNotComfirm}</span>
				) : (
					<Spin indicator={<LoadingOutlined style={{ fontSize: 16, marginLeft: '10px' }} spin />} />
				)}
			</h3> */}
			<CommonTable
				// item={list}
				handleSubmit={handleConfirmDelete}
				handleConfirmOrder={handleConfirmOrder}
			/>

			{/* <List
				className="demo-loadmore-list showScroll"
				loading={initLoading}
				itemLayout="horizontal"
				// header={['name', 'quantity']}
				// loadMore={loadMore}
				dataSource={list}
				renderItem={(item) => (
					<List.Item
						actions={[
							<Button type="dashed" onClick={() => handleConfirmDelete(item._id, true)}>
								Hủy bỏ
							</Button>,
							<Button type="primary">Xác nhận</Button>,
						]}
					>
						<Skeleton avatar title={false} loading={item.loading} active>
							<List.Item.Meta
								avatar={
									<Avatar
										src={'https://top10dienbien.com/wp-content/uploads/2022/10/avatar-cute-9.jpg'}
									/>
								}
								title={`Bàn số ${item.tableNumber}`}
								description={item.location}
							/>
							<div>{item.productId?.name || 'no data'}</div>
							<div style={{ marginLeft: '40px' }}>{item.quantity || '0'}</div>
						</Skeleton>
					</List.Item>
				)}
			/> */}
			{/* <PaginationCustom data={list.length} pageSize={5} onChangeItem={onLoadMore} /> */}
		</>
	)
}

export default OrderByUser
