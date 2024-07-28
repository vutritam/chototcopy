import ReactToPrint, { useReactToPrint } from 'react-to-print'
import ComponentToPrint from './componentToPrint'
import { CopyOutlined, EditOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { AnyIfEmpty, useDispatch, useSelector } from 'react-redux'
import { updatePaymentForTableNumber } from '@/redux/componentSlice/orderSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'

interface Props {
	dataSubmit?: any
	totalPrice?: any
}
interface Data {
	tableNumber: string
	phone: string
	address: string
}

const data: Data = {
	tableNumber: '',
	phone: '',
	address: '',
}
const PrintToExport: React.FC<Props> = ({ dataSubmit, totalPrice }) => {
	const [edit, setEdit] = useState({ isShow: false, name: '' })
	const dataAllOrderTableNumber = useSelector(
		(state: any) => state.dataOrder?.dataOrderByNumberTable.data
	)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const componentRef = useRef<HTMLDivElement>(null)
	const initValue = {
		tableNumber: '0',
		phone: '0967979049',
		address: 'Âps vịnh, xã an cơ, châu thành, tây ninh',
	}

	const [data, setData] = useState(initValue)
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	})

	const handleEdit = (fieldName: any, valueInput = '') => {
		for (const key in data) {
			if (key === fieldName && !Object.values(data).includes('')) {
				const nameKey = key
				setEdit({ isShow: !edit.isShow, name: nameKey })
			}
		}
	}

	const handleChangeData = (field: any, value: any) => {
		setData({ ...data, [field]: value })
	}

	const handleForcusOut = (e: React.FocusEvent<HTMLInputElement>) => {
		const name = e.target.name as keyof Data // Đây là cách đảm bảo rằng name là một key hợp lệ của Data
		if (data[name] !== '') {
			handleEdit(name, e.target.value)
		}
	}

	const handleAfterPrint = () => {
		console.log('Sau khi in')

		// Thực hiện các hành động sau khi in nếu cần
	}

	const clickedItem = async () => {
		const dataObj = {
			tableNumber: dataAllOrderTableNumber?.tableNumber,
			objValues: { status: 'order_done' },
		}
		const { payload } = await dispatch(updatePaymentForTableNumber(dataObj))
		console.log(dataAllOrderTableNumber?.data[0]?.tableNumber, 'dataAllOrderTableNumber')
	}

	useEffect(() => {
		window.addEventListener('afterprint', handleAfterPrint)

		return () => {
			// Cleanup: loại bỏ sự kiện khi component unmount
			window.removeEventListener('afterprint', handleAfterPrint)
		}
	}, [])

	return (
		<div className="bg-gray-200 p-6">
			<Button
				type="primary"
				className="bg-gray-500 border border-gray-500 p-2 mb-4"
				onClick={clickedItem}
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
