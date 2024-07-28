import { Button, Dropdown, Menu, Space } from 'antd'

interface CommonFilterProps {
	items: any[] // Bạn có thể thay 'any' bằng type cụ thể của items nếu biết rõ
	state: any // Bạn có thể thay 'any' bằng type cụ thể của state nếu biết rõ
	fieldName: string
	handleLocationChange: (location: any, item: any) => void // Bạn có thể thay 'any' bằng type cụ thể của location nếu biết rõ
}
const CommonFilter: React.FC<CommonFilterProps> = ({
	items,
	state,
	fieldName,
	handleLocationChange,
}) => {
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
								disabled={item.value === state}
								onClick={() => handleLocationChange(fieldName, item.value)}
							>
								{item.label}
							</Menu.Item>
						))}
					</Menu>
				)
			}}
		>
			<Button style={{ width: '100%' }}>{state !== 'all' ? state : 'Tất cả'}</Button>
		</Dropdown>
	)
}

export default CommonFilter
