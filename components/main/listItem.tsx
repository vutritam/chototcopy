import { MessageOutlined, StarOutlined } from '@ant-design/icons'
import { Image, List, Space, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import CommonModal from '../srcModalOrder/modalOrder'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProduct } from '@/redux/componentSlice/productSlice'

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

const ListItem: React.FC = () => {
	let router = useRouter()
	const [loading, setLoading] = useState(true)
	const [dataList, setDataList] = useState([])
	const dataStore = useSelector((state) => state.products.products.data)
	const dispatch = useDispatch()

	useEffect(() => {
		setLoading(true)
		;(async () => {
			const allProduct = await dispatch(fetchAllProduct())
			if (allProduct?.payload?.success) {
				setLoading(false)
				setDataList(allProduct?.payload?.data)
			}
		})()
	}, [])

	useEffect(() => {
		if (!dataStore?.status) {
			setDataList(dataStore?.data)
		}
	}, [dataStore])
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
							id: item._id,
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
							router.pathname.includes('/order') ? (
								<CommonModal tittle="Xác nhận chọn món này ?" label="chọn ngay" item={item} />
							) : (
								''
							),
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
								<span>
									Giá:
									<span style={{ color: 'blue', marginLeft: '10px' }}>
										<span className="">{item.price}</span>
									</span>
								</span>
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
