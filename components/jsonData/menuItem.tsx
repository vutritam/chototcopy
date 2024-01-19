import React, { useState } from 'react'
import { Menu } from 'antd'
import {
	MailOutlined,
	SettingOutlined,
	AppstoreOutlined,
	CalendarOutlined,
} from '@ant-design/icons'
import { Badge } from 'antd'
import { useRouter } from 'next/router'
import Link from 'next/link'

const { SubMenu } = Menu
interface inputProps {
	mode: string
	selectedKeys: string[]
	defaultSelectedKeys: string[]
	items?: any
	theme: string
}

// Sử dụng CustomMenu
const SiderBarMenuCustom = (props: inputProps) => {
	const { mode, selectedKeys, defaultSelectedKeys, items, theme } = props
	const [state, setState] = useState([])
	const router = useRouter()

	// Hàm kiểm tra điều kiện để hiển thị icon
	const shouldDisplayIcon = (item) => {
		// Thêm logic kiểm tra điều kiện ở đây
		// Ví dụ: hiển thị icon nếu có một điều kiện cụ thể
		return item.label && item.label?.props?.children === 'Yêu cầu' // Thay 'sub1' bằng điều kiện của bạn
	}
	const handleChoosePath = (path, e) => {
		// e.domEvent.defaultPrevented()
		router.push(path)
	}
	const handleSelect = (a) => {
		const { key, keyPath, selectedKeys, domEvent } = a

		const selectedTitle = items
			.flatMap((item) => (item.children ? item.children : [item]))
			.find((item) => {
				return item.key === key
			})?.label

		let removeDuplicate = [...state, ...keyPath]
		keyPath.includes(key) &&
			selectedTitle.props &&
			selectedTitle.props.children === 'Yêu cầu' &&
			setState([...new Set(removeDuplicate)])
	}

	// Hàm tạo MenuItem với kiểm tra điều kiện
	const createMenuItem = (item) => {
		if (shouldDisplayIcon(item)) {
			// Nếu điều kiện thỏa mãn, sử dụng icon tùy chỉnh
			return (
				<Menu mode="inline">
					<Link href={item.path}>
						<a>
							<Menu.Item key="yourKey" icon={item.icon}>
								{item.label}
							</Menu.Item>
						</a>
					</Link>
					{/* Add other menu items as needed */}
				</Menu>
			)
		} else {
			// Nếu không, sử dụng icon được chỉ định trong phần tử
			return (
				<Menu.Item key={item.key} icon={item.icon} onClick={(e) => handleChoosePath(item.path, e)}>
					{item.label}
				</Menu.Item>
			)
		}
	}

	const CustomMenu = ({ style, defaultSelectedKeys, defaultOpenKeys, mode, theme, items }) => {
		return (
			<Menu
				style={style}
				defaultSelectedKeys={defaultSelectedKeys}
				defaultOpenKeys={defaultOpenKeys}
				mode={mode}
				theme={theme}
				onSelect={handleSelect}
			>
				{items.map((item) =>
					item.children ? (
						<SubMenu
							key={item.key}
							icon={state.includes(item.key) ? item.icon : <Badge count={2} />}
							title={item.label}
						>
							{item.children.map((child) => createMenuItem(child))}
						</SubMenu>
					) : (
						createMenuItem(item)
					)
				)}
			</Menu>
		)
	}
	return (
		<CustomMenu
			style={{ width: 256 }}
			mode={mode}
			selectedKeys={selectedKeys}
			defaultSelectedKeys={defaultSelectedKeys}
			items={items}
			theme={theme}
		/>
	)
}

export default SiderBarMenuCustom
