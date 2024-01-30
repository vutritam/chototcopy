import React, { useRef } from 'react'
import { Button, Modal } from 'antd'
import { EyeOutlined, CopyOutlined } from '@ant-design/icons'
import PrintToExport from './printExport'

const ModalBill: React.FC = ({ open, handleShowBill, dataSubmit, totalPrice }) => {

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
					<PrintToExport dataSubmit={dataSubmit} totalPrice={totalPrice}/>
					// <ExportHTMLToPDF getContentForExport={elementRef} handleShowBill={handleShowBill} />
				}
			>
			</Modal>
		</>
	)
}

export default ModalBill
