// employee.tsx
import React from 'react'
import ListItem from '@/components/main/listItem'
import EmployeeWareHouseComponent from '@/components/wareHouse/wareHouseComponent'

interface EmployeeProps {}

const EmployeeWareHouse: React.FC<EmployeeProps> = () => {
	return (
		<>
			<EmployeeWareHouseComponent />
			<ListItem isPage="employee" />
		</>
	)
}

export default EmployeeWareHouse
