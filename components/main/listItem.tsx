import { MessageOutlined, StarOutlined } from '@ant-design/icons'
import { Button, Image, List, Space, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import CommonModal from '../modalUserOrder/modalOrder'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProduct, fetchAllProductPaginated } from '@/redux/componentSlice/productSlice'
import Link from 'next/link'
import { getListProduct, onScrollList } from '../utilsComponent/utils'
import VirtualList from 'rc-virtual-list'
// import ProductDetail from '@/pages/employee/product-detail/[detail]'
// import SearchParam from '@/utils/searchParamQuery'

const IconText = ({
	icon,
	text,
	color,
	onClick,
}: {
	icon: React.FC
	text: string
	color: string
	onClick: () => void
}) => {
	return (
		<Space onClick={onClick}>
			{React.createElement(icon, { style: { color: color } })}
			{text}
		</Space>
	)
}
interface inputProps {
	isPage: string
}
const ListItem = (props: inputProps) => {
	const { isPage } = props
	const [loading, setLoading] = useState(false)
	const [dataList, setDataList] = useState([])
	const dataStore = useSelector((state) => state.products.products.data)
	const itemOrder = useSelector((state: any) => state.dataOrder?.dataOrderByNumberTable?.data)
	const [dataAllList, setDataAllList] = useState([])
	const [countNumber, setCountNumber] = useState(1)
	const dispatch = useDispatch()

	useEffect(() => {
		;(async () => {
			await getListProduct(dispatch, setLoading, setDataAllList)
		})()
	}, [dispatch, setLoading, setDataAllList])

	const appendData = async (countNumber) => {
		if (loading) return // Tránh gọi nếu đang trong quá trình loading

		setLoading(true)

		try {
			const { payload } = await dispatch(
				fetchAllProductPaginated({ pageNumber: countNumber, limitCount: 3 })
			)

			if (payload?.success) {
				const uniqueSet = new Set([...dataList, ...payload?.data])
				setDataList([...uniqueSet])
			}
		} finally {
			setLoading(false)
		}
	}
	console.log(dataList, 'sss')

	useEffect(() => {
		try {
			appendData(countNumber)
		} catch (error) {
			console.error('Error in appendData:', error)
		}
	}, [countNumber])

	const renderBtn = (isPage, item = null) => {
		let getLocationOrderUser = JSON.parse(sessionStorage.getItem('location_user'))
		const itemAllOrder =
			itemOrder !== null && typeof itemOrder === 'object' && !Array.isArray(itemOrder)
				? itemOrder.data
				: itemOrder
		const filterItemOrderPending = itemAllOrder?.find(
			(element) =>
				element?.productId?._id === item._id &&
				getLocationOrderUser?.tableNumber === element?.tableNumber &&
				element?.status === 'order_inprogess'
		)
		const currentOrderItem = itemAllOrder?.find(
			(element) => element?.productId?._id === item._id && element?.status === 'order_inprogess'
		)

		switch (isPage) {
			case 'order':
				return (
					<>
						<CommonModal
							tittle={filterItemOrderPending ? 'Đặt thêm món ?' : 'Xác nhận chọn món này ?'}
							label={!filterItemOrderPending ? 'Đặt ngay' : 'Đặt thêm'}
							type={filterItemOrderPending ? 'changeOrder' : 'order'}
							item={filterItemOrderPending ? currentOrderItem : item}
						/>
					</>
				)
			case 'admin':
				return (
					<>
						<Button>Kiểm kê kho</Button>
						<Button>Xem báo cáo/thống kế</Button>
					</>
				)
			case 'employee':
				return (
					<>
						<Button>
							<Link href="/employee/warehouse/history-transactions">Lịch sử giao dịch</Link>
						</Button>
						<Button>
							{/* <SearchParam
								pathUrl={'detail'}
								pathName="/employee/product-detail"
								param={item.id}
								title={'ádasd'}
							/> */}
							<Link href={`/employee/product-detail/${item.id}`}>Chi tiết sản phẩm</Link>
						</Button>
					</>
				)

			default:
				break
		}
	}

	const ContainerHeight = 148 * 3

	return (
		<>
			<List
				responsive={{
					xs: 1, // Giảm số cột trên mỗi hàng cho màn hình di động
					sm: 2,
					md: 3,
					lg: 4,
					xl: 4,
					xxl: 4,
				}}
				loading={loading}
				itemLayout="vertical"
				size="large"
			>
				<VirtualList
					data={dataList}
					height={ContainerHeight}
					itemHeight={47}
					itemKey="email"
					onScroll={(e) =>
						onScrollList(e, ContainerHeight, setCountNumber, countNumber, dataAllList)
					}
				>
					{(item) => (
						<List.Item
							key={item.id}
							actions={[renderBtn(isPage, item)]}
							extra={
								<div className="show-desktop-menu">
									<Image
										width={172}
										height={172}
										style={{ objectFit: 'contain' }}
										src={item.file}
									/>
								</div>
							}
						>
							<List.Item.Meta
								style={{ margin: 10 }}
								avatar={
									<Image
										width={50}
										height={50}
										style={{ borderRadius: '50px', objectFit: 'cover' }}
										alt="logo"
										src={item.file}
									/>
								}
								title={item.name}
								description={
									<>
										<span>
											Giá:
											<span style={{ color: 'blue', marginLeft: '10px' }}>
												<span className="">{item.price}</span>
											</span>
										</span>
										<div className="flex-box">
											<span>
												Số lượng:{' '}
												{item.quantity > 0 ? (
													item.quantity
												) : (
													<span style={{ color: 'red' }}>Đã hết hàng</span>
												)}
											</span>
										</div>
									</>
								}
							/>

							{item.Description}
						</List.Item>
					)}
				</VirtualList>
			</List>
		</>
	)
}

export default ListItem
