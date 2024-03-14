// Import thư viện crypto-js
import CryptoJS from 'crypto-js'

const hexToBase64 = (hexString) => {
	// Chuyển đổi chuỗi hex sang mảng byte
	const bytes = []
	for (let i = 0; i < hexString.length; i += 2) {
		bytes.push(parseInt(hexString.substr(i, 2), 16))
	}
	// Chuyển đổi mảng byte sang chuỗi base64
	const base64String = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.create(bytes))
	return base64String
}

// Mã hóa số bàn thành chuỗi
const encodeTableNumber = (tableNumber: number, locationId: string) => {
	const dataToEncode = tableNumber.toString() + '_' + locationId
	const encryptedString = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(dataToEncode))
	return encryptedString
}

const decodeTableNumber = (encodedString) => {
	let decryptedData = null
	try {
		// Giải mã chuỗi từ base64
		const decodedString = CryptoJS.enc.Base64.parse(decodeURIComponent(encodedString)).toString(
			CryptoJS.enc.Utf8
		)

		// Phân tách chuỗi đã giải mã thành tableNumber và locationId
		const decodedArray = decodedString.split('_')
		console.log(decodedArray, 'decodedArray')

		const decryptedNumber = parseInt(decodedArray[0], 10)
		const decryptedLocationId = decodedArray[1]

		decryptedData = { tableNumber: decryptedNumber, locationId: decryptedLocationId }
	} catch (error) {
		console.error('Error decoding:', error.message)
	}
	return decryptedData
}

export { encodeTableNumber, decodeTableNumber }
// // Sử dụng
// const tableNumber = 42;
// const encodedString = encodeTableNumber(tableNumber);
// console.log(encodedString); // Chuỗi đã mã hóa
// const decodedNumber = decodeTableNumber(encodedString);
// console.log(decodedNumber); // Số bàn đã giải mã
