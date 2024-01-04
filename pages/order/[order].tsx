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
	const [show, setShow] = useState(true)
	const router = useRouter()
	const handleShow = () => {
		setShow(false)
	}

	useEffect(() => {
		const getLocationOrder = JSON.parse(sessionStorage.getItem('location_user'))
		if (getLocationOrder && getLocationOrder.location) {
			setShow(false)
		}
	}, [])
	useEffect(() => {
		// setLoading(true)

		const convertedValue = processRouterQuery(router?.query)
		setIdTable(convertedValue)
	}, [router?.query])

	return (
		<>
			{show ? (
				<ComfirmLocationOrder
					label="Xác nhận nơi đặt"
					tittle="Xác nhận nơi đặt"
					open={show}
					handleShow={handleShow}
					idTable={idTable}
				/>
			) : null}

			<Products />
		</>
	)
}
OrderPage.Layout = function getLayout(page) {
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

export default OrderPage
