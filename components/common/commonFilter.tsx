import { Button, Dropdown, Menu, Space } from 'antd'
import InputDateTime from './inputDateTime'
import { useEffect, useState } from 'react'

const CommonFilter: React.FC = ({ items, state, fieldName, handleLocationChange }) => {
	// const [labelAll, setLableAll] = useState(state === 'Tất cả' ? 'all' : state)

	return (
		<Dropdown
			menu={{ items }}
			placement="bottom"
			dropdownRender={(menu) => {
				return (
					<Menu>
						{items?.map((item) => (
							<Menu.Item
								key={item.key}
								value={state}
								disabled={item.value === state}
								onClick={() => handleLocationChange(fieldName, item.value)}
							>
								{item.label}
							</Menu.Item>
						))}
					</Menu>
				)
				// )}
			}}
		>
			<Button>{state !== 'all' ? state : 'Tất cả'}</Button>
		</Dropdown>
	)
}

export default CommonFilter
