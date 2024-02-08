export const handleTextL10N = (text: string, arrayNumberReplace: Array) => {
	let newString = text
	if (arrayNumberReplace !== null && arrayNumberReplace.length > 0) {
		arrayNumberReplace.forEach((p) => {
			newString = newString.replace('&n', String(p))
		})
	}
	return newString.replace('&n', '')
}

export const sortByStatus = (array, status) => {
	const sortedArr = array.slice().sort((a, b) => {
		// So sánh theo trạng thái "pending" hoặc không
		if (a.status === status && b.status !== status) {
			return -1
		} else if (a.status !== status && b.status === status) {
			return 1
		} else {
			return 0
		}
	})
	return sortedArr
}

export const sortByLatestDate = (data, datePropertyName) => {
	console.log(data, 'data sort')

	return data.sort((a, b) => {
		const dateA = a[datePropertyName]
		const dateB = b[datePropertyName]

		return dateB - dateA // Sắp xếp giảm dần (mới nhất đầu tiên)
	})
}
