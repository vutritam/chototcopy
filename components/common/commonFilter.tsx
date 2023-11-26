import { Button, Dropdown, Menu, Space } from 'antd'
import InputDateTime from './inputDateTime'
import { useEffect, useState } from 'react'

const CommonFilter: React.FC = ({ items, state, fieldName, handleLocationChange }) => {
	// const [labelAll, setLableAll] = useState(state === 'Tất cả' ? 'all' : state)

	return (
		<Dropdown
			className="ok"
			menu={{ items }}
			placement="bottom"
			dropdownRender={(menu) => {
				return (
					<Menu style={{ width: '100%' }}>
						{items?.map((item) => (
							<Menu.Item
								key={item.key}
								style={{ width: '100%' }}
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
			<Button style={{ width: '100%' }}>{state !== 'all' ? state : 'Tất cả'}</Button>
		</Dropdown>
	)
}

export default CommonFilter
