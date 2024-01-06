import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import Products from '@/components/main/products'
// import { decodeNumber, encodeNumber } from '@/components/common/hashCode'
import ComfirmLocationOrder from '@/components/srcConfirmLocation/confirmLocation'
import { processRouterQuery } from '@/components/common/parseNumber'
import MasterLayout from '@/components/masterLayout/masterLayout'
import { itemsOrder } from '@/components/jsonData/menuData'
import Products from '@/components/main/products'

const OrderPage: React.FC = () => {
	const [idTable, setIdTable] = useState<any>(0)
	const [show, setShow] = useState(false)
	const router = useRouter()
	const handleShow = () => {
		setShow(false)
	}

	useEffect(() => {
		const getLocationOrder = JSON.parse(sessionStorage.getItem('location_user'))
		const convertedValue = processRouterQuery(router?.query)
		if (getLocationOrder !== null) {
			if (getLocationOrder?.tableNumber !== convertedValue && !getLocationOrder.location) {
				setShow(true)
			} else {
				setShow(false)
			}
		} else {
			setShow(true)
		}
		setIdTable(convertedValue)
	}, [router?.query.order])

	return (
		<>
			<ComfirmLocationOrder
				label="Xác nhận nơi đặt"
				tittle="Xác nhận nơi đặt"
				open={show}
				handleShow={handleShow}
				idTable={idTable}
			/>

			<Products />
		</>
	)
}

export default OrderPage
