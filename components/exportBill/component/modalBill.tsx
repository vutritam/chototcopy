import React, { useRef } from 'react'
import { Button, Modal } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import ExportHTMLToPDF from '../exportBill'
import ListUser from '@/components/main/listUser'

const ModalBill: React.FC = ({ open, handleShowBill, dataSubmit, totalPrice }) => {
	const elementRef = useRef(null)

	const getContentForExport = (
		<div ref={elementRef}>
			<ListUser data={dataSubmit} />
		</div>
	)

	return (
		<>
			<Button type="primary" onClick={handleShowBill} icon={<EyeOutlined />}>
				Xem bill
			</Button>
			<Modal
				title="Hóa đơn thanh toán"
				open={open}
				onCancel={handleShowBill}
				footer={
					<ExportHTMLToPDF getContentForExport={elementRef} handleShowBill={handleShowBill} />
				}
			>
				{getContentForExport}
			</Modal>
		</>
	)
}

export default ModalBill
