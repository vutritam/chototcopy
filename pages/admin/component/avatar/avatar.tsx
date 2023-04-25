import React from 'react'
import {
	DownOutlined,
	UserOutlined,
	LoginOutlined,
	LogoutOutlined,
	SettingOutlined,
	AudioOutlined,
	BellOutlined,
} from '@ant-design/icons'
import { Avatar, MenuProps } from 'antd'
import { Dropdown, Space, Input, Tooltip } from 'antd'
import SelectSearch from '../common/inputSelectSearch'

const items: MenuProps['items'] = [
	{
		label: (
			<a className="style-menu" href="https://www.antgroup.com">
				<LoginOutlined />
				Đăng ký
			</a>
		),
		key: '0',
	},
	{
		label: (
			<a className="style-menu" href="https://www.aliyun.com">
				<LogoutOutlined />
				Đăng nhập
			</a>
		),
		key: '1',
	},
	{
		type: 'divider',
	},
	{
		label: (
			<a className="style-menu" href="https://www.aliyun.com">
				<SettingOutlined />
				Quản lý tài khoản
			</a>
		),
		key: '3',
	},
]
const { Search } = Input

const suffix = (
	<AudioOutlined
		style={{
			fontSize: 16,
			color: '#1890ff',
		}}
	/>
)

const onSearch = (value: string) => console.log(value)
const AvatarComponent: React.FC = () => (
	<div>
		<div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
			<SelectSearch />
			<Space wrap>
				<Tooltip title="Bạn có 23 thông báo cho danh mục sản phẩm" color={'red'} key={'red'}>
					<BellOutlined style={{ fontSize: '24px', width: '30px' }} />
				</Tooltip>
			</Space>

			<Dropdown menu={{ items }} trigger={['click']}>
				<a onClick={(e) => e.preventDefault()} style={{ color: '#050354' }}>
					<Space>
						<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
						vũ trí tâm
						<DownOutlined />
					</Space>
				</a>
			</Dropdown>
		</div>
	</div>
)

export default AvatarComponent
