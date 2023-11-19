import React from 'react'
import { Dropdown, Space } from 'antd'

interface inputProps {
	trigger: Array<string>
	handleDropdown?: (e: any, value: boolean) => void
	tittle: string
	items: any
}

const CommonDropdown = (props: inputProps): JSX.Element => {
	const { trigger, handleDropdown, tittle, items } = props
	return (
		<Dropdown menu={{ items }} trigger={trigger}>
			{/* <a onClick={(e) => handleDropdown(e, true)}> */}
			<Space>{tittle}</Space>
			{/* </a> */}
		</Dropdown>
	)
}

export default CommonDropdown
