// AdminLayout.tsx
import React, { useState } from 'react'
import PrivateRoute from '@/components/common/privateRoute'
import MasterLayout from '@/components/masterLayout/masterLayout'

interface LayoutProps {
	children: React.ReactNode
	allowedRoles: string[]
	itemData: any
	isPage: string
}

const Layout: React.FC<LayoutProps> = ({ children, allowedRoles, itemData, isPage }) => {
	const [selectedItemKey, setSelectedItemKey] = useState(null)

	const handleMenuClick = (item) => {
		if (item) {
			sessionStorage.setItem('clickItemChecked', item.key)
		}
	}

	return (
		<PrivateRoute allowedRoles={allowedRoles}>
			<MasterLayout
				itemsSiderBar={itemData}
				isPage={isPage}
				selectedItemKey={selectedItemKey}
				handleMenuClick={handleMenuClick}
			>
				{children}
			</MasterLayout>
		</PrivateRoute>
	)
}

export default Layout
