import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import Products from '@/components/main/products'
// import { decodeNumber, encodeNumber } from '@/components/common/hashCode'
import RenderedComponent from '@/components/common/renderComponent'
import ComfirmLocationOrder from '@/components/common/confirmLocation'
import { processRouterQuery } from '@/components/common/parseNumber'

const App: React.FC = () => {
	const [idTable, setIdTable] = useState<any>(0)
	const [show, setShow] = useState(true)
	const router = useRouter()
	const handleShow = () => {
		setShow(false)
	}

	useEffect(() => {
		const getLocationOrder = JSON.parse(localStorage.getItem('location_user'))
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
				/>
			) : null}

			<RenderedComponent />
		</>
	)
}

export default App
