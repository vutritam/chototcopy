import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import Products from '@/components/main/products'
// import { decodeNumber, encodeNumber } from '@/components/common/hashCode'
import ComfirmLocationOrder from '@/components/confirmLocation/confirmLocation'
import { processRouterQuery } from '@/components/common/parseNumber'
import MasterLayout from '@/components/masterLayout/masterLayout'
import { itemsOrder } from '@/components/jsonData/menuData'
import OrderComponent from '@/components/main/order'
import ListItem from '@/components/main/listItem'

const OrderPage: React.FC = () => {
	return (
		<>
			<OrderComponent />
			<ListItem isPage="order" />
		</>
	)
}

export default OrderPage
