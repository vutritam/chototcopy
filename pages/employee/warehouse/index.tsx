// employee.tsx
import React from 'react'
import ListItem from '@/components/main/listItem'

interface EmployeeProps {}

const EmployeeWareHouse: React.FC<EmployeeProps> = () => {
	return <ListItem isPage="employee" />
}

export default EmployeeWareHouse
