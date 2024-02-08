export const localDataWithCustomDataUtil = (item: any) => {
	const localDataWithCustomData =
		item !== null && typeof item === 'object' && !Array.isArray(item)
			? item?.data?.map((record: any) => ({
					...record,
					customData: {
						tableNumber: record.tableNumber,
						status: record.status,
						_id: record._id,
						location: record.locationId?.nameLocation,
						locationId: record.locationId?._id,
						productId: record.productId,
						isPaid: record.isPaid,
					},
			  }))
			: item?.map((record: any) => ({
					...record,
					customData: {
						tableNumber: record.tableNumber,
						status: record.status,
						_id: record._id,
						location: record.locationId?.nameLocation,
						locationId: record.locationId?._id,
						productId: record.productId,
						isPaid: record.isPaid,
					},
			  }))
	return localDataWithCustomData
}

export const localDataWithCustomDataForBillUtil = (
	itemAllOrder: any,
	handleForBill: any,
	open: boolean = false
) => {
	const data =
		itemAllOrder !== null && typeof itemAllOrder === 'object' && !Array.isArray(itemAllOrder)
			? itemAllOrder.data
			: itemAllOrder
	let itemsMaping: any[] = []
	let tableStatusMap: any[] = []

	data &&
		data.forEach((order) => {
			const { tableNumber, status, isPaid } = order
			const existingIndex = tableStatusMap.findIndex((item) => item.tableNumber === tableNumber)

			if (existingIndex !== -1) {
				const shouldUpdateStatus = open
					? status === 'order_success' && !isPaid
					: status === 'order_done' && !isPaid
				if (shouldUpdateStatus) {
					tableStatusMap[existingIndex] = { tableNumber, status, isPaid }
				}
			} else {
				tableStatusMap.push({ tableNumber, status, isPaid })
			}
		})

	const resultTableNumbers = tableStatusMap.filter((table) => {
		const { status, isPaid } = table
		const shouldInclude = open
			? status === 'order_success' && !isPaid
			: status === 'order_done' && !isPaid
		return shouldInclude
	})

	if (resultTableNumbers.length > 0) {
		itemsMaping = resultTableNumbers
			.sort((a, b) => a.tableNumber - b.tableNumber)
			.map((table, index) => {
				const i = parseInt(table.tableNumber, 10)
				return {
					key: index,
					label: <p onClick={() => handleForBill(i)}>{`Bàn ${i}`}</p>,
				}
			})
	} else {
		itemsMaping = [
			{
				key: 0,
				label: <p>Chưa có bàn nào</p>,
			},
		]
	}

	return itemsMaping
}
