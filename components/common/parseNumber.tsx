import { decodeNumber, encodeNumber } from './hashCode'

// logic.js
export function processRouterQuery(routerQuery) {
	let num = routerQuery?.order || null
	let convert

	if (isNaN(num)) {
		const [decoded, originalNum] = decodeNumber(num)
		convert = decoded
	} else {
		convert = encodeNumber(Number(num))
	}

	return convert
}
