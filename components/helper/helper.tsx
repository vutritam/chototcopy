export const handleTextL10N = (text: string, arrayNumberReplace: Array) => {
	let newString = text
	if (arrayNumberReplace !== null && arrayNumberReplace.length > 0) {
		arrayNumberReplace.forEach((p) => {
			newString = newString.replace('&n', String(p))
		})
	}
	return newString.replace('&n', '')
}
