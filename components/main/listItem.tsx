import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import { Avatar, Button, List, Space, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import CommonModal from '../common/commonModal'
import { useRouter } from 'next/router'

const data = Array.from({ length: 23 }).map((_, i) => ({
	href: 'https://ant.design',
	title: `ant design part ${i}`,
	avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
	description:
		'Ant Design, a design language for background applications, is refined by Ant UED Team.',
	content:
		'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}))

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
	<Space>
		{React.createElement(icon)}
		{text}
	</Space>
)

const ListItem: React.FC = () => {
	let router = useRouter()
	const [loading, setLoading] = useState(true)
	const [openModal, setOpenModal] = useState(false)
	useEffect(() => {
		// setLoading(true)
		setTimeout(() => {
			setLoading(false)
		}, 1000)
	}, [])
	// console.log(router.pathname, 'kkk')

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
					dataSource={data}
					footer={
						<div>
							<b>ant design</b> footer part
						</div>
					}
					renderItem={(item) => (
						<List.Item
							key={item.title}
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
							extra={
								<img
									width={272}
									alt="logo"
									src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
								/>
							}
						>
							<List.Item.Meta
								avatar={<Avatar src={item.avatar} />}
								title={<a href={item.href}>{item.title}</a>}
								description={item.description}
							/>
							{item.content}
						</List.Item>
					)}
				/>
			)}
		</>
	)
}

export default ListItem
