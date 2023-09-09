import React, { useEffect, useState } from 'react'
import { Affix, Avatar, Button, List, Skeleton } from 'antd'
import PaginationCustom from '@/components/common/pagination'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import {
	deleteOrder,
	fetchAllOrder,
	fetchAllOrderByUser,
	setOrder,
} from '@/redux/componentSlice/orderSlice'
import { fetchAllProduct } from '@/redux/componentSlice/productSlice'
import Toasty from '@/components/common/toasty'
import CommonTable from '@/components/common/commonTable'
import ModalConfirm from '@/components/common/modalConfirm'

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
	const dataList = useSelector((state: any) => state.dataOrder?.dataOrder?.data)
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	const [list, setList] = useState<DataType[]>([])
	let getLocationEmployee = JSON.parse(localStorage.getItem('user') || '')
	const [open, setOpen] = useState(false)
	const [idOrder, setIdOrder] = useState(null)
	// useEffect(() => {}, [])
	useEffect(() => {
		// Fetch dữ liệu ban đầu và cập nhật state
		const fetchData = async () => {
			const { payload } = await dispatch(fetchAllOrderByUser())
			if (!payload?.success) {
				Toasty.error(payload?.message)
			}
			setInitLoading(false)
			setData(payload.data)
			setList(payload.data)
			setInitLoading(false)
		}

		fetchData()
	}, [])

	const onLoadMore = (page) => {
		setLoading(true)
		setList(
			data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} })))
		)
	}

	const loadMore =
		!initLoading && !loading ? (
			<div
				style={{
					textAlign: 'right',
					marginTop: 12,
					height: 32,
					lineHeight: '32px',
				}}
			>
				{/* <Affix offsetBottom={150}> */}
				<Button onClick={onLoadMore} type="primary">
					loading more
				</Button>
				{/* </Affix> */}
			</div>
		) : null
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
			<CommonTable item={list} handleSubmit={handleConfirmDelete} />
		</>
	)
}

export default OrderByAllUser
