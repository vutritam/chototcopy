import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { encodeTableNumber } from '@/components/common/hashCode'

const QRcode: React.FC = () => {
	const [dataQR, setData] = useState<Array<object>>([])
	const [value, setValue] = useState(0)
	const handleRandomTable = () => {
		let array: Array<object> = []

		if (isNaN(value) || value <= 0) {
			alert('Vui lòng nhập số hợp lệ')
			return
		}

		let convertNumber = Number(value)
		for (let index = 1; index <= convertNumber; index++) {
			let table = {
				tittle: `bàn số ${index}`,
				tableNumber: index,
				linkOrder: `http://localhost:3000/order/${encodeTableNumber(index)}`,
				code: encodeTableNumber(index),
			}

			if (!array.includes(table)) {
				array.push(table)
			}
		}
		setData(array)
		return
	}
	return (
		<div className="App">
			<h1>Hotspot app</h1>
			<input
				placeholder="nhập số lượng bàn"
				onChange={(e) => setValue(Number(e?.target?.value) || 0)}
			/>
			<button onClick={() => handleRandomTable()}>Tạo QR</button>
			<h2>Visitors, scan the following qr code</h2>
			{dataQR?.map((e, index) => (
				<>
					<h2>Bàn số: {index + 1}</h2>
					<div>Code: {e?.code}</div>
					<QRCode key={index} value={e?.linkOrder} size={250} />
					<br />
				</>
			))}
		</div>
	)
}

export default QRcode
