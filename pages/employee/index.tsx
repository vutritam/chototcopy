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

export default Employee
