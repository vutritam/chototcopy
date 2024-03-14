import { MessageOutlined, StarOutlined } from '@ant-design/icons'
import { Button, Image, List, Space, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import CommonModal from '../modalUserOrder/modalOrder'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProduct } from '@/redux/componentSlice/productSlice'
import Link from 'next/link'
import { getListProduct } from '../utilsComponent/utils'
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
	const [loading, setLoading] = useState(true)
	const [dataList, setDataList] = useState([])
	const dataStore = useSelector((state) => state.products.products.data)
	const itemOrder = useSelector((state: any) => state.dataOrder?.dataOrderByNumberTable?.data)

	const dispatch = useDispatch()

	useEffect(() => {
		;(async () => {
			await getListProduct(dispatch, setLoading, setDataList)
		})()
	}, [dispatch, setLoading, setDataList])

	useEffect(() => {
		if (dataStore?.success) {
			setDataList(dataStore?.data)
		}
	}, [dataStore])

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
							<Link href={`/employee/product-detail/${item.id}`}>Chi tiết sản phẩm</Link>
						</Button>
					</>
				)

			default:
				break
		}
	}
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
				pagination={{
					onChange: (page) => {
						console.log(page)
					},
					pageSize: 3,
				}}
				dataSource={
					dataList &&
					dataList.map((item, index) => {
						return {
							Description: item.Description,
							EndDate: item.EndDate,
							Like: item.Like,
							StartDate: item.StartDate,
							file: item.file,
							name: item.name,
							position: item.position,
							price: item.price,
							quantity: item.quantity,
							status: item.status,
							viewer: item.Viewer,
							_id: item._id,
						}
					})
				}
				footer={
					<div>
						<b>Tạo Bởi by Tam Vu Tri</b>
					</div>
				}
				renderItem={(item) => (
					<List.Item
						key={item.id}
						actions={[
							<IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
							<IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
							renderBtn(isPage, item),
						]}
						extra={
							<div className="show-desktop-menu">
								<Image
									width={172}
									height={172}
									style={{ objectFit: 'contain' }}
									alt="logo"
									src={process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/${item.file}`}
								/>
							</div>
						}
					>
						<List.Item.Meta
							avatar={
								<Image
									width={50}
									height={50}
									style={{ borderRadius: '50px', objectFit: 'cover' }}
									alt="logo"
									src={process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/${item.file}`}
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
									<div>
										Số lượng:{' '}
										{item.quantity > 0 ? (
											item.quantity
										) : (
											<span style={{ color: 'red' }}>Đã hết hàng</span>
										)}
									</div>
								</>
							}
						/>
						{item.Description}
					</List.Item>
				)}
			/>
		</>
	)
}

export default React.memo(ListItem)
