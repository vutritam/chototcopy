// encode a number
const encodeNumber = (num: number) => {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz'
	const base = alphabet.length
	let encoded = ''

	// Convert number to a string in base-26
	while (num > 0) {
		const remainder = num % base
		num = Math.floor(num / base)
		encoded = alphabet[remainder] + encoded
	}

	// Append original number to the end of the encoded string
	encoded += num.toString()

	return encoded
}

// decode a string
const decodeNumber = (encoded: string) => {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz'
	const base = alphabet.length

	// Extract original number from end of the encoded string
	const num = parseInt(encoded.slice(-1))
	let decoded = 0

	// Convert base-26 string to a number
	for (let i = 0; i < encoded.length - 1; i++) {
		const exponent = encoded.length - i - 2
		const digit = alphabet.indexOf(encoded[i])
		decoded += digit * Math.pow(base, exponent)
	}

	return [decoded, num]
}
export { encodeNumber, decodeNumber }
