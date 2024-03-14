import { Avatar, List } from 'antd'
import React from 'react'

const ListUser: React.FC = (props) => {
	const { data } = props

	return (
		<List
			loading={data?.length > 0 ? false : true}
			itemLayout="horizontal"
			dataSource={data}
			renderItem={(item, index) => (
				<List.Item>
					<List.Item.Meta
						avatar={
							<Avatar
								src={process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/${item?.productId[0]?.file}`}
							/>
						}
						title={<a href="https://ant.design">{item.productId[0].name}</a>}
						description={
							<>
								<p>{item?.productId[0]?.Description}</p>
								<span>
									Giá:
									<span style={{ color: 'blue', marginLeft: '10px' }}>
										{item.productId[0].price}
									</span>
								</span>
							</>
						}
					/>
				</List.Item>
			)}
		/>
	)
}

export default ListUser
