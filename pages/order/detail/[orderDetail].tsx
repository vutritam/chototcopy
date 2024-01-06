// employee.tsx
import React, { useState } from 'react'
import { itemsEmployee, itemsOrder } from '@/components/jsonData/menuData'
import MasterLayout from '@/components/masterLayout/masterLayout'
import DetailOrder from '@/components/main/detailOrder'

interface OrderDetailProps {}

const OrderDetail: React.FC<OrderDetailProps> = () => {
	return <DetailOrder />
}

export default OrderDetail
