import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	deleteAllRecordOrder,
	fetchAllOrderByUserRole,
	setOrderByNumberTable,
	updateStatusOrder,
} from '@/redux/componentSlice/orderSlice'
import Toasty from '@/components/common/toasty'
import { io } from 'socket.io-client'
import CommonTable from '@/components/common/commonTable/commonTableListOrder'
import { Button } from 'antd'
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons'

const OrderByAllUser: React.FC = () => {
	const [initLoading, setInitLoading] = useState(true)
	const dispatch = useDispatch()
	// const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	let getLocationEmployee = JSON.parse(sessionStorage.getItem('user') || '')
	const [open, setOpen] = useState(false)
	const [idOrder, setIdOrder] = useState(null)
	const [countOrderDoNotComfirm, setCountOrderDontConfirm] = useState(0)
	const [refreshPage, setRefresh] = useState(false)
	const [dummyOrderConfirm, setDummyConfirm] = useState([])
	const [loadingDataTable, setLoadingDataTable] = useState(false)
	const [socket, setSocket] = useState(null)
	const dataAllOrderAdmin = useSelector((state: any) => state.dataOrder?.dataAllOrderAdmin?.data)

	useEffect(() => {
		// Fetch dữ liệu ban đầu và cập nhật state
		const ENV_HOST = process.env.NEXT_PUBLIC_HOST
		const newSocket = io(ENV_HOST)
		setSocket(newSocket)
		let obj = {
			location: getLocationEmployee?.data?.locationId,
			userRole: getLocationEmployee?.data?.roles[0],
		}

		const fetchData = async () => {
			const { payload } = await dispatch(fetchAllOrderByUserRole(obj))
			if (!payload?.success) {
				Toasty.error(payload?.message)
			} else {
				setInitLoading(false)
				let filterOrderDoNotComfirm = payload.data.reduce((accumulator, currentValue) => {
					if (currentValue.status === 'order_inprogess') {
						return accumulator + 1
					}
					return accumulator
				}, 0)
				setCountOrderDontConfirm(filterOrderDoNotComfirm)
				setData(payload.data)
				setInitLoading(false)
			}
		}

		fetchData()
		return () => {
			newSocket.disconnect()
		}
	}, [refreshPage])

	useEffect(() => {
		if (socket) {
			socket.emit('joinRoom', `room-${getLocationEmployee.data.locationId}`)
			socket.on('resProductOrder', async (response) => {
				await dispatch(setOrderByNumberTable(response))
				setData(response.data)
			})
		}
	}, [socket])

	const handleConfirmDelete = (id, showModal) => {
		setOpen(showModal)
		setIdOrder(id)
	}

	const handleConfirmOrder = async (item) => {
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

			if (payload?.success) {
				if (socket) {
					// gửi sự kiện get sản phẩm
					socket.emit('getAllOrderByStatus', {
						tableNumber: item.tableNumber,
						locationId: item.locationId,
					})
					setLoadingDataTable(false)
				}
			}
		}
	}

	const handleDeleteAllRecord = async () => {
		const { payload } = await dispatch(deleteAllRecordOrder())
		Toasty.success(payload?.message)
	}

	return (
		<>
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
					Làm mới
				</Button>
				<Button
					type="default"
					onClick={() => handleDeleteAllRecord()}
					icon={<DeleteOutlined color="red" />}
				>
					Xóa tất cả đơn
				</Button>
			</div>
			<CommonTable
				item={dataAllOrderAdmin}
				dummyOrderConfirm={dummyOrderConfirm}
				handleSubmit={handleConfirmDelete}
				handleConfirmOrder={handleConfirmOrder}
				loadingDataTable={loadingDataTable}
			/>
		</>
	)
}

export default OrderByAllUser
