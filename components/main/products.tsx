import * as React from 'react'
import ListItem from './listItem'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import { Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'
export interface IAppProps {}

export default function Products(props: IAppProps) {
	const items: MenuProps['items'] = [
		{
			key: '1',
			label: (
				<a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
					1st menu item
				</a>
			),
		},
		{
			key: '2',
			label: (
				<a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
					2nd menu item
				</a>
			),
		},
		{
			key: '3',
			label: (
				<a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
					3rd menu item
				</a>
			),
		},
	]
	return (
		<div>
			<div
				className="catelories"
				style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}
			>
				<Space direction="vertical">
					<Dropdown menu={{ items }} placement="bottomLeft">
						<MenuUnfoldOutlined style={{ fontSize: '20px', display: 'flex' }} />
					</Dropdown>
				</Space>
				<Space wrap>
					<b style={{ fontSize: '17px' }}>Danh mục sản phẩm (100)</b>
				</Space>
			</div>
			<div>
				<ListItem />
			</div>
		</div>
	)
}
