import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Products from '@/components/main/products'
import { decodeNumber, encodeNumber } from '@/components/common/hashCode'
import RenderedComponent from '@/components/common/renderComponent'

const App: React.FC = () => {
	const [idTable, setIdTable] = useState<any>(0)

	const router = useRouter()

	useEffect(() => {
		// setLoading(true)
		let num = router?.query?.order || null // c0
		let convert
		if (isNaN(num)) {
			const [decoded, originalNum] = decodeNumber(num)
			convert = decoded
		} else {
			convert = encodeNumber(Number(num))
		}
		setIdTable(convert)
	}, [router?.query])

	return (
		<>
			<RenderedComponent />
		</>
	)
}

export default App
