import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import { Avatar, Button, List, Space, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import CommonModal from '../common/commonModal'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { fetchAllProduct } from '@/redux/componentSlice/productSlice'

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
	<Space>
		{React.createElement(icon)}
		{text}
	</Space>
)

const ListItem: React.FC = () => {
	let router = useRouter()
	const [loading, setLoading] = useState(true)
	const [dataList, setDataList] = useState([])
	const dispatch = useDispatch()
	useEffect(() => {
		// setLoading(true)
		;(async () => {
			const { payload } = await dispatch(fetchAllProduct())
			if (payload.success) {
				setTimeout(() => {
					setLoading(false)
					setDataList(payload.data)
				}, 1000)
			}
		})()
	}, [])

	return (
		<>
			{loading ? (
				<div className="custom-login">
					<Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
						<Spin tip="Loading" size="small">
							<div className="content" />
						</Spin>
					</Space>
				</div>
			) : (
				<List
					itemLayout="vertical"
					size="large"
					pagination={{
						onChange: (page) => {
							console.log(page)
						},
						pageSize: 3,
					}}
					dataSource={dataList.map((item, index) => {
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
					})}
					footer={
						<div>
							<b>ant design</b> footer part
						</div>
					}
					renderItem={(item) => (
						<List.Item
							key={item.id}
							actions={[
								<IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
								<IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
								<IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
								router.pathname.includes('/order') ? (
									<CommonModal tittle="Xác nhận chọn món này ?" label="chọn" item={item} />
								) : (
									''
								),
							]}
							extra={<img width={172} alt="logo" src={item.file} />}
						>
							<List.Item.Meta
								avatar={<Avatar src={item.file} />}
								title={item.name}
								description={item.Description}
							/>
							{item.Description}
						</List.Item>
					)}
				/>
			)}
		</>
	)
}

export default ListItem
