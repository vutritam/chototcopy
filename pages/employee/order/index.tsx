import React, { useEffect, useState } from 'react'
import { Button, Spin } from 'antd'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
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

const OrderByUser: React.FC = () => {
	const [initLoading, setInitLoading] = useState(true)
	const [open, setOpen] = useState(false)
	const dispatch = useDispatch()
	const [idOrder, setIdOrder] = useState(null)
	const [data, setData] = useState<DataType[]>([])
	const list = useSelector((state: any) => state.dataOrder?.dataOrderByNumberTable?.data)
	const [socket, setSocket] = useState(null)
	const [refreshPage, setRefresh] = useState(false)
	const [countOrderDoNotComfirm, setCountOrderDontConfirm] = useState(0)

	const getLocationEmployee =
		sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))
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
				// setList(payload.data)
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
					// setList(response.data)
					await dispatch(setOrderByNumberTable(response.data))
					setData(response.data)
				}
			})
		}
	}, [socket])

	const handleConfirmOrder = async (item) => {
		if (item) {
			await dispatch(updateStatusOrder({ id: item._id, status: 'order_success' }))
			if (socket) {
				// gửi sự kiện get sản phẩm
				socket.emit('getAllOrderByStatus', {
					tableNumber: item.tableNumber,
					location: item.location,
				})
			}
		}
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
			setData(payload.data)
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
			<CommonTable
				item={list}
				handleSubmit={handleConfirmDelete}
				handleConfirmOrder={handleConfirmOrder}
			/>
		</>
	)
}

export default OrderByUser
