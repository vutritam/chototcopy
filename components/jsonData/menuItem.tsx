// MenuItem.js
import React from 'react'
import Link from 'next/link'

interface inputProps {
	title: any
	key: string
	icon: any
	children: any
	link: any
}

const MenuItem = (props: inputProps): JSX.Element => {
	const { title, key, icon, children, link } = props
	return (
		<div key={key} className="custom-menu-item">
			{link ? <Link href={link}>{title}</Link> : <div>{title}</div>}
			{icon}
			{children && <div>{children}</div>}
		</div>
	)
}

export default MenuItem
