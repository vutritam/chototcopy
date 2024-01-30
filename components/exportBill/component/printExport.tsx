import ReactToPrint, { useReactToPrint } from 'react-to-print'
import ComponentToPrint from './componentToPrint'
import { CopyOutlined, EditOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'

const PrintToExport: React.FC = ({ dataSubmit, totalPrice }) => {
	const [edit, setEdit] = useState({ isShow: false, name: '' })
	const componentRef = useRef()
	const initValue = {
		tableNumber: '0',
		phone: '0967979049',
		address: 'Âps vịnh, xã an cơ, châu thành, tây ninh',
	}

	const [data, setData] = useState(initValue)
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	})

	const handleEdit = (fieldName, valueInput = '') => {
		for (const key in data) {
			if (key === fieldName && !Object.values(data).includes('')) {
				const nameKey = key
				setEdit({ isShow: !edit.isShow, name: nameKey })
			}
		}
	}

	const handleChangeData = (field, value) => {
		setData({ ...data, [field]: value })
	}

	const handleForcusOut = (e) => {
		if (data[e.target.name] !== '') {
			handleEdit(e.target.name, e?.target.value)
		}
	}

	return (
		<div className="bg-gray-200 p-6">
			<Button
				type="primary"
				className="bg-gray-500 border border-gray-500 p-2 mb-4"
				onClick={handlePrint}
				icon={<CopyOutlined />}
			>
				Xuất ra hóa đơn
			</Button>
			<ComponentToPrint
				ref={componentRef}
				dataSubmit={dataSubmit}
				totalPrice={totalPrice}
				edit={edit}
				handleEdit={handleEdit}
				userData={data}
				handleForcusOut={handleForcusOut}
				handleChangeData={handleChangeData}
			/>
		</div>
	)
}

export default PrintToExport
