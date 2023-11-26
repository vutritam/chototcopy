import React, { useEffect, useState } from 'react'
// import { Affix, Avatar, Button, List, Skeleton } from 'antd'
// import PaginationCustom from '@/components/common/pagination'
// import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { deleteAllRecordOrder, fetchAllOrderByUserRole } from '@/redux/componentSlice/orderSlice'
// import { fetchAllProduct } from '@/redux/componentSlice/productSlice'
import Toasty from '@/components/common/toasty'
import CommonTable from '@/components/common/commonTable'
import { Button, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
// import ModalConfirm from '@/components/common/modalConfirm'

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
	// const dataList = useSelector((state: any) => state.dataOrder?.dataOrder?.data)
	const dispatch = useDispatch()
	// const [loading, setLoading] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	const [list, setList] = useState<DataType[]>([])
	let getLocationEmployee = JSON.parse(sessionStorage.getItem('user') || '')
	const [open, setOpen] = useState(false)
	const [idOrder, setIdOrder] = useState(null)
	const [countOrderDoNotComfirm, setCountOrderDontConfirm] = useState(0)
	const [refreshPage, setRefresh] = useState(false)
	// const [page, setPage] = useState(1)
	// useEffect(() => {}, [])
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
				// console.log(filterOrderDoNotComfirm, 'filterOrderDoNotComfirm')

				setData(payload.data)
				setList(payload.data)
				setInitLoading(false)
			}
		}

		fetchData()
	}, [refreshPage])

	// const onLoadMore = (page) => {
	// 	setLoading(true)
	// 	setList(
	// 		data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} })))
	// 	)
	// }

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
	// const handleDeleteItem = async () => {
	// 	const { payload } = await dispatch(
	// 		deleteOrder({ id: idOrder, location: getLocationEmployee?.data?.location })
	// 	)
	// 	if (payload?.data?.length > 0) {
	// 		setList(payload.data)
	// 		setData(payload.data)
	// 	}
	// 	Toasty.success(payload?.message)
	// }
	const handleConfirmDelete = (id, showModal) => {
		setOpen(showModal)
		setIdOrder(id)
	}
	const handleDeleteAllRecord = async () => {
		const { payload } = await dispatch(deleteAllRecordOrder())
		Toasty.success(payload?.message)
	}

	// const removeData = () => {
	// 	// Xóa dữ liệu khỏi mảng data
	// 	const newData = data.slice(0, 10); // Giả định xóa 10 dòng đầu tiên
	// 	setData(newData);
	//   };

	return (
		<>
			{/* <ModalConfirm
				label=""
				title="Xác nhận xóa item này ?"
				position="renderConfirmDeleteItemOrder"
				open={open}
				setOpen={setOpen}
				handleSubmit={handleDeleteItem}
				size={500}
			/> */}
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
			<CommonTable item={list} handleSubmit={handleConfirmDelete} />
		</>
	)
}

export default OrderByAllUser
