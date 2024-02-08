import * as React from 'react'
import _ from 'lodash'
import CommonFilterListItem from '../common/commonFilterListItem/commonFilter'
import { fetchAllProduct } from '@/redux/componentSlice/productSlice'
import { useDispatch } from 'react-redux'

export default function EmployeeWareHouseComponent() {
	const [allProduct, setAllProduct] = React.useState([])
	const dispatch = useDispatch()

	React.useEffect(() => {
		const fetchData = async () => {
			const { payload } = await dispatch(fetchAllProduct())
			if (payload?.success) {
				setAllProduct(payload.data)
			}
		}
		fetchData()
	}, [])

	return (
		<div>
			<CommonFilterListItem allProduct={allProduct} />
		</div>
	)
}
