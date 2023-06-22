import React, { useEffect, useState } from 'react'
import { Affix, Avatar, Button, List, Skeleton } from 'antd'
import PaginationCustom from '@/components/common/pagination'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrder, setOrder } from '@/redux/componentSlice/orderSlice'
import { fetchAllProduct } from '@/redux/componentSlice/productSlice'
import Toasty from '@/components/common/toasty'

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

const OrderByUser: React.FC = () => {
	const [initLoading, setInitLoading] = useState(true)
	const dataList = useSelector((state: any) => state.dataOrder?.dataOrder?.data)
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	const [list, setList] = useState<DataType[]>([])
	const [socket, setSocket] = useState(null)
	let getLocationEmployee = JSON.parse(localStorage.getItem('user') || '')
	// useEffect(() => {}, [])
	useEffect(() => {
		const newSocket = io('http://localhost:3500')
		setSocket(newSocket)

		// Fetch dữ liệu ban đầu và cập nhật state
		const fetchData = async () => {
			const { payload } = await dispatch(fetchAllOrder({ location: getLocationEmployee.location }))
			console.log(payload, 'pa')

			if (payload?.success) {
				setInitLoading(false)
				setData(payload.data)
				setList(payload.data)
			}
			Toasty.error(payload?.message)
			setInitLoading(false)
		}

		fetchData()

		return () => {
			newSocket.disconnect()
		}
	}, [])

	useEffect(() => {
		if (socket) {
			socket.emit('joinRoom', 'room')
			socket.on('resProductOrder', (response) => {
				let item = response.data?.find((item) => item?.location)
				if (item?.location === getLocationEmployee?.location) {
					setList(response.data)
					setData(response.data)
				}
			})
		}
	}, [socket])

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

	return (
		<>
			<List
				className="demo-loadmore-list showScroll"
				loading={initLoading}
				itemLayout="horizontal"
				header={['name', 'quantity']}
				// loadMore={loadMore}
				dataSource={list}
				renderItem={(item) => (
					<List.Item
						actions={[
							<Button type="dashed">Hủy bỏ</Button>,
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
			/>
			<PaginationCustom data={list.length} pageSize={5} onChangeItem={onLoadMore} />
		</>
	)
}

export default OrderByUser
