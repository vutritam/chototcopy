// employee.tsx
import React, { useState } from 'react'
import ListItem from '@/components/main/listItem'

interface EmployeeProps {}

const Employee: React.FC<EmployeeProps> = () => {
	return <ListItem isPage="employee" />
}

export default Employee
