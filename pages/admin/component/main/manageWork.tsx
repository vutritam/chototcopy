import { Button, Tabs } from 'antd'
import React from 'react'
import ListItem from './listItem'
import ManageMoney from './manageMoney'

type Props = {}

export default function ManageWork({}: Props) {
	const onChange = (key: string) => {
		console.log(key)
	}
	const items = [
		{
			label: `Danh sách đơn hàng`,
			key: 1,
			children: <ListItem />,
		},
		{
			label: `Quản lý thu và chi`,
			key: 2,
			children: <ManageMoney />,
		},
		{
			label: `Phiếu thanh toán nợ`,
			key: 3,
			children: `Content of Tab Pane 3`,
		},
	]
	return (
		<div>
			<div>
				<ul>
					<li className="flex-box">
						<div>Mã ca</div>
						<div>1231203asdhasgdashdj</div>
					</li>
					<li className="flex-box">
						<div>Nhân viên</div>
						<div>1231203asdhasgdashdj</div>
					</li>
					<li className="flex-box">
						<div>Giờ đóng ca</div>
						<div>1231203asdhasgdashdj</div>
					</li>
					<li className="flex-box">
						<div>Giờ mở ca</div>
						<div>1231203asdhasgdashdj</div>
					</li>
					<li className="flex-box">
						<div>
							<Button type="primary">Đóng ca</Button>
						</div>
						<div>Chi tiết ca</div>
					</li>
				</ul>
			</div>
			<div>
				<Tabs
					onChange={onChange}
					type="card"
					items={items.map((ele, i) => {
						const id = String(i + 1)
						return {
							label: ele.label,
							key: ele.key,
							children: ele.children,
						}
					})}
				/>
			</div>
		</div>
	)
}
