import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAllRecordOrder, fetchAllOrderByUserRole } from '@/redux/componentSlice/orderSlice'
import Toasty from '@/components/common/toasty'
import CommonTable from '@/components/common/commonTable'
import { Button, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
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

const count = 3

const OrderByAllUser: React.FC = () => {
	const [initLoading, setInitLoading] = useState(true)
	const dispatch = useDispatch()
	// const [loading, setLoading] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	let getLocationEmployee = JSON.parse(sessionStorage.getItem('user') || '')
	const [open, setOpen] = useState(false)
	const [idOrder, setIdOrder] = useState(null)
	const [countOrderDoNotComfirm, setCountOrderDontConfirm] = useState(0)
	const [refreshPage, setRefresh] = useState(false)
	const dataAllOrderAdmin = useSelector((state: any) => state.dataOrder?.dataAllOrderAdmin?.data)

	useEffect(() => {
		// Fetch dữ liệu ban đầu và cập nhật state
		let obj = {
			location: getLocationEmployee?.data?.location,
			userRole: getLocationEmployee?.data?.roles[0],
		}

		const fetchData = async () => {
			const { payload } = await dispatch(fetchAllOrderByUserRole(obj))
			if (!payload?.success) {
				Toasty.error(payload?.message)
			} else {
				setInitLoading(false)
				let filterOrderDoNotComfirm = payload.data.reduce(
					(accumulator, currentValue) => {
						if (currentValue.status === 'order_inprogess') {
							return accumulator + 1
						}
						return accumulator
					},

					0
				)
				setCountOrderDontConfirm(filterOrderDoNotComfirm)
				setData(payload.data)
				setInitLoading(false)
			}
		}

		fetchData()
	}, [refreshPage])

	const handleConfirmDelete = (id, showModal) => {
		setOpen(showModal)
		setIdOrder(id)
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
				<Button type="primary" onClick={() => setRefresh(true)}>
					Refresh
				</Button>
				<Button type="default" onClick={() => handleDeleteAllRecord()}>
					Delete All
				</Button>
				{/* <Button type="default" onClick={() => handleDeleteAllRecordNotification()}>
					Delete All Notification
				</Button> */}
			</div>
			<h3>
				Số đơn chưa xác nhận:{' '}
				{countOrderDoNotComfirm > 0 ? (
					<span style={{ color: 'red' }}>{countOrderDoNotComfirm}</span>
				) : (
					<Spin indicator={<LoadingOutlined style={{ fontSize: 16, marginLeft: '10px' }} spin />} />
				)}
			</h3>
			<CommonTable item={dataAllOrderAdmin} handleSubmit={handleConfirmDelete} />
		</>
	)
}

export default OrderByAllUser
