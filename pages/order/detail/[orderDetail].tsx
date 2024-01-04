// employee.tsx
import React, { useState } from 'react'
import { itemsEmployee, itemsOrder } from '@/components/jsonData/menuData'
import MasterLayout from '@/components/masterLayout/masterLayout'
import DetailOrder from '@/components/main/detailOrder'

interface OrderDetailProps {}

const OrderDetail: React.FC<OrderDetailProps> = () => {
	return <DetailOrder />
}

OrderDetail.Layout = function getLayout(page) {
	const [selectedItemKey, setSelectedItemKey] = useState(null)

	const handleMenuClick = (item) => {
		if (item) {
			sessionStorage.setItem('clickItemChecked', item.key)
		}
	}

	return (
		<MasterLayout
			itemsSiderBar={itemsOrder}
			isPage="employee"
			selectedItemKey={selectedItemKey}
			handleMenuClick={handleMenuClick}
		>
			{page}
		</MasterLayout>
	)
}

export default OrderDetail
