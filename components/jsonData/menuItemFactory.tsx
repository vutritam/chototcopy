// MenuItemsFactory.js
import React from 'react'
import MenuItem from './menuItem'
import { Badge, MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem
}
interface inputProps {
	title: any
	key: string
	icon: any
	children?: any
	link: any
}

const ItemData = (props: inputProps): JSX.Element => {
	const { title, key, icon, children, link } = props
	return (
		<MenuItem title={title} key={key} icon={icon} link={link}>
			{children &&
				children.map((item: any) => getItem(item.title, item.key, item.children, item.link))}
		</MenuItem>
	)
}

export default ItemData
