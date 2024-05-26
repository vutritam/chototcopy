// import { decodeNumber, encodeNumber } from './hashCode'
import _ from 'lodash'
import { decodeTableNumber, encodeTableNumber } from './hashCode'
import { useRouter } from 'next/router'
// logic.js
export function processRouterQuery(routerQuery) {
	let num = routerQuery || {}
	let convert
	convert = decodeTableNumber(num)
	// if (!_.has(convert, 'tableNumber') || !_.has(convert, 'locationId')) {
	// 	window.location.href = '/404'
	// }
	return convert
}
