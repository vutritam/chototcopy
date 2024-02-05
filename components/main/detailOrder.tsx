import { Avatar, Button, List, Skeleton, Space, Spin, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { decodeNumber, encodeNumber } from '../common/hashCode'
import { RollbackOutlined } from '@ant-design/icons'
import PaginationCustom from '../common/pagination'
import { io } from 'socket.io-client'
import { setMessage } from '@/redux/componentSlice/messageSocketSlice'
import Toasty from '../common/toasty'
import { fetchAllOrder, fetchOrderByNumberTable } from '@/redux/componentSlice/orderSlice'
import { useDispatch } from 'react-redux'

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
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`
const DetailOrder: React.FC = () => {
	const dispatch = useDispatch()
	const [idTable, setIdTable] = useState<any>(0)
	let router = useRouter()

	const [initLoading, setInitLoading] = useState(true)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	const [list, setList] = useState<DataType[]>([])
	const [socket, setSocket] = useState(null)

	useEffect(() => {
		const ENV_HOST = process.env.NEXT_PUBLIC_HOST
		const newSocket = io(ENV_HOST)
		setSocket(newSocket)
		if (socket) {
			// Gửi sự kiện tới Socket.IO server
			socket.on('response', async (response) => {
				await dispatch(setMessage(response))
				localStorage.setItem('notification', JSON.stringify(response))
			})
		}

		// Fetch dữ liệu ban đầu và cập nhật state
		const fetchData = async () => {
			// console.log(idTable, 'idTable')
			const { payload } = await dispatch(fetchOrderByNumberTable({ tableNumber: idTable }))
			if (payload?.success) {
				setInitLoading(false)
				setData(payload.data)
				setList(payload.data)
				return
			}
			Toasty.error(payload?.message)
			setInitLoading(false)
		}

		fetchData()

		setTimeout(() => {
			setLoading(false)
		}, 1000)
		return () => {
			newSocket.disconnect()
		}
	}, [idTable])

	useEffect(() => {
		// setLoading(true)
		const { orderDetail } = router.query
		// Giải mã chuỗi JSON
		const order = JSON.parse(orderDetail)
		let num = order.order || null // c0
		let convert
		if (isNaN(num)) {
			const [decoded, originalNum] = decodeNumber(num)
			convert = decoded
		} else {
			convert = encodeNumber(Number(num))
		}

		setIdTable(convert)
	}, [router?.query])

	const onLoadMore = (page) => {
		setLoading(true)
		setList(
			data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} })))
		)
		fetch(fakeDataUrl)
			.then((res) => res.json())
			.then((res) => {
				const newData = data.concat(res.results)
				setData(newData)
				setList(newData)
				setLoading(false)
				// Resetting window's offsetTop so as to display react-virtualized demo underfloor.
				// In real scene, you can using public method of react-virtualized:
				// https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
				window.dispatchEvent(new Event('resize'))
			})
	}

	const handleGoBack = () => {
		router.back()
	}
	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
				<div>
					<Tooltip placement="left" title={'quay lại'}>
						<RollbackOutlined
							style={{ color: 'blue', fontSize: '17px', cursor: 'pointer' }}
							onClick={handleGoBack}
						/>
					</Tooltip>
				</div>
				<h4 style={{ margin: '0' }}>Danh sách đặt món bàn của bạn ({idTable})</h4>
			</div>
			<List
				className="demo-loadmore-list showScroll"
				loading={initLoading}
				itemLayout="horizontal"
				// loadMore={loadMore}
				dataSource={list}
				renderItem={(item) => (
					<List.Item actions={[<Button type="dashed">Hủy bỏ</Button>]}>
						<Skeleton avatar title={false} loading={item.loading} active>
							<List.Item.Meta
								avatar={
									<Avatar
										src={'https://top10dienbien.com/wp-content/uploads/2022/10/avatar-cute-9.jpg'}
									/>
								}
								title={`Bàn số ${item.tableNumber}`}
								description={item.locationId?.nameLocation}
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

export default DetailOrder
