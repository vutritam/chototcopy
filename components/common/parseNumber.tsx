// import { decodeNumber, encodeNumber } from './hashCode'
import _ from 'lodash'
import { decodeTableNumber, encodeTableNumber } from './hashCode'
// logic.js
export function processRouterQuery(routerQuery) {
	let num = routerQuery || {}
	let convert
	if (!_.isNil(num) && !_.isObject(num)) {
		convert = decodeTableNumber(num)
	}
	console.log(convert, 'ggg')

	return convert
}
