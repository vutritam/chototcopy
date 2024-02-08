import ReactToPrint, { useReactToPrint } from 'react-to-print'
import ComponentToPrint from './componentToPrint'
import { CopyOutlined, EditOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updatePaymentForTableNumber } from '@/redux/componentSlice/orderSlice'

const PrintToExport: React.FC = ({ dataSubmit, totalPrice }) => {
	const [edit, setEdit] = useState({ isShow: false, name: '' })
	const dataAllOrderTableNumber = useSelector(
		(state: any) => state.dataOrder?.dataOrderByNumberTable.data
	)
	const dispatch = useDispatch()
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

	const handleAfterPrint = () => {
		console.log('Sau khi in')

		// Thực hiện các hành động sau khi in nếu cần
	}

	const clickedItem = async () => {
		const { payload } = await dispatch(
			updatePaymentForTableNumber({
				tableNumber: dataAllOrderTableNumber?.data[0]?.tableNumber,
				objValues: { status: 'order_done' },
			})
		)
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
