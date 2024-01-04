// employee.tsx
import React, { useState } from 'react'
import { itemsAdmin } from '@/components/jsonData/menuData'
import MasterLayout from '@/components/masterLayout/masterLayout'
import PrivateRoute from '@/components/common/privateRoute'

interface AdminProps {}

const AdminPage: React.FC<AdminProps> = () => {
	return <>AdminPage</>
}

AdminPage.Layout = function getLayout(page) {
	const [selectedItemKey, setSelectedItemKey] = useState(null)

	const handleMenuClick = (item) => {
		if (item) {
			sessionStorage.setItem('clickItemChecked', item.key)
		}
	}

	return (
		<PrivateRoute allowedRoles={['admin']}>
			<MasterLayout
				itemsSiderBar={itemsAdmin}
				isPage="admin"
				selectedItemKey={selectedItemKey}
				handleMenuClick={handleMenuClick}
			>
				{page}
			</MasterLayout>
		</PrivateRoute>
	)
}

export default AdminPage
