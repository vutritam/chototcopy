import React, { useEffect, useState } from 'react'
import { Button, Spin } from 'antd'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import {
	deleteAllRecordOrder,
	deleteOrder,
	fetchAllOrderByUserRole,
	fetchOrderByNumberTable,
	setOrderByNumberTable,
	updateStatusOrder,
} from '@/redux/componentSlice/orderSlice'
import Toasty from '@/components/common/toasty'
import ModalConfirm from '@/components/common/commonModal/modalConfirm'
import CommonTable from '@/components/common/commonTable/commonTableListOrder'
import { deleteAllRecordNotification } from '@/redux/componentSlice/messageSocketSlice'
import BillExport from '@/components/srcExportBill/modalBillExport'
import CartItem from '@/components/main/cartItem'
import { ReloadOutlined } from '@ant-design/icons'
import MasterLayout from '@/components/masterLayout/masterLayout'
import { itemsEmployee } from '@/components/jsonData/menuData'
import PrivateRoute from '@/components/common/privateRoute'
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
	const [orderData, setOrderData] = useState(null)
	const [data, setData] = useState<DataType[]>([])
	const list = useSelector((state: any) => state.dataOrder?.dataOrderByNumberTable?.data)
	const [socket, setSocket] = useState(null)
	const [refreshPage, setRefresh] = useState(false)
	const [dummyOrderConfirm, setDummyConfirm] = useState([])
	const [loadingDataTable, setLoadingDataTable] = useState(false)

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
				setInitLoading(false)
				await dispatch(setOrderByNumberTable(payload.data))
				setData(payload.data)
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
			socket.emit('joinRoom', `room-${getLocationEmployee?.data?.location}`)
			socket.on('resProductOrder', async (response) => {
				await dispatch(setOrderByNumberTable(response))
				setData(response.data)
			})
		}
	}, [socket])

	const handleConfirmOrder = async (e, item) => {
		e.isDefaultPrevented()
		if (item) {
			setLoadingDataTable(true)
			const { payload } = await dispatch(
				updateStatusOrder({ id: item._id, status: 'order_success' })
			)

			const isIdExists = dummyOrderConfirm.some((order) => order.id === item._id)

			if (!isIdExists) {
				setDummyConfirm((prevDummy) => {
					return [...prevDummy, { id: item._id, message: 'đã xác nhận' }]
				})
			}

			if (payload.success) {
				if (socket) {
					// gửi sự kiện get sản phẩm
					socket.emit('getAllOrderByStatus', {
						tableNumber: item.tableNumber,
						location: item.location,
					})
					setLoadingDataTable(false)
				}
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
			if (socket) {
				// gửi sự kiện get sản phẩm
				socket.emit('getAllOrderByStatus', {
					tableNumber: orderData.tableNumber,
					location: orderData.location,
				})
				setLoadingDataTable(false)
			}
		}

		Toasty.success(payload?.message)
		setRefresh(!refreshPage)
	}

	const handleConfirmDelete = (id, showModal) => {
		setOpen(showModal)
		setIdOrder(id._id)
		setOrderData(id)
	}

	return (
		<>
			<ModalConfirm
				label=""
				title="Xác nhận xóa đơn này ?"
				position="renderConfirmDeleteItemOrder"
				open={open}
				item={orderData}
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
				<Button type="primary" onClick={() => setRefresh(true)} icon={<ReloadOutlined />}>
					Refresh
				</Button>
			</div>
			<CartItem className="exportBill" />

			<CommonTable
				item={list}
				dummyOrderConfirm={dummyOrderConfirm}
				handleSubmit={handleConfirmDelete}
				handleConfirmOrder={handleConfirmOrder}
				loadingDataTable={loadingDataTable}
			/>
		</>
	)
}

export default OrderByUser
