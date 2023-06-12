import React, { useEffect, useState } from 'react'
import { Affix, Avatar, Button, List, Skeleton } from 'antd'
import PaginationCustom from '@/components/common/pagination'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { setOrder } from '@/redux/componentSlice/orderSlice'
import { fetchAllProduct } from '@/redux/componentSlice/productSlice'

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
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	const [list, setList] = useState<DataType[]>([])
	const [socket, setSocket] = useState(null)

	// useEffect(() => {}, [])
	useEffect(() => {
		;(async () => {
			const newSocket = io('http://localhost:3500')
			setSocket(newSocket)
			const { payload } = await dispatch(fetchAllProduct())
			if (payload.success) {
				setInitLoading(false)
				setData(payload.data)
				setList(payload.data)
			}
		})()
		// if (socket) {
		// 	// Gửi sự kiện tới Socket.IO server
		// 	socket.on('response', async (response) => {
		// 		await dispatch(setMessage(response))
		// 		// localStorage.setItem('notification', JSON.stringify(response))
		// 		console.log('Received response:', response)
		// 	})
		// }
	}, [])

	useEffect(() => {
		console.log('listening socket', socket)
		if (socket && socket.connected) {
			socket.on('resProductOrder', async (response) => {
				// await dispatch(setOrder(response))
				// localStorage.setItem('notification', JSON.stringify(response))
				console.log('Received resProductOrder:', response)
			})
			// setInitLoading(false)
			// 	setData(res.results)
			// 	setList(res.results)
			return () => {
				socket.disconnect()
			}
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
								avatar={<Avatar src={item.file} />}
								title={item.name}
								description={item.Description}
							/>
							<div>{item.EndDate}</div>
						</Skeleton>
					</List.Item>
				)}
			/>
			<PaginationCustom data={list.length} pageSize={5} onChangeItem={onLoadMore} />
		</>
	)
}

export default OrderByUser
