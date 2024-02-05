// Import thư viện crypto-js
import CryptoJS from 'crypto-js'

// Mã hóa số bàn thành chuỗi
const encodeTableNumber = (tableNumber: number) => {
	const encryptedString = encodeURIComponent(
		CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(tableNumber.toString()))
	)
	return encryptedString
}

// Giải mã chuỗi thành số bàn
const decodeTableNumber = (encodedString: string) => {
	let decryptedNumber = null
	try {
		decryptedNumber = parseInt(
			CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encodedString)),
			10
		)
	} catch (error) {
		console.error('Error decoding:', error.message)
	}
	return decryptedNumber
}
export { encodeTableNumber, decodeTableNumber }
// // Sử dụng
// const tableNumber = 42;
// const encodedString = encodeTableNumber(tableNumber);
// console.log(encodedString); // Chuỗi đã mã hóa
// const decodedNumber = decodeTableNumber(encodedString);
// console.log(decodedNumber); // Số bàn đã giải mã
