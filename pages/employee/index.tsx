// employee.tsx
import React, { useState } from 'react'
import { itemsEmployee } from '@/components/jsonData/menuData'
import MasterLayout from '@/components/masterLayout/masterLayout'
import PrivateRoute from '@/components/common/privateRoute'
import ListItem from '@/components/main/listItem'

interface EmployeeProps {}

const Employee: React.FC<EmployeeProps> = () => {
	return <ListItem />
}

Employee.Layout = function getLayout(page) {
	const [selectedItemKey, setSelectedItemKey] = useState(null)

	const handleMenuClick = (item) => {
		if (item) {
			sessionStorage.setItem('clickItemChecked', item.key)
		}
	}

	return (
		<PrivateRoute allowedRoles={['client']}>
			<MasterLayout
				itemsSiderBar={itemsEmployee}
				isPage="employee"
				selectedItemKey={selectedItemKey}
				handleMenuClick={handleMenuClick}
			>
				{page}
			</MasterLayout>
		</PrivateRoute>
	)
}

export default Employee
