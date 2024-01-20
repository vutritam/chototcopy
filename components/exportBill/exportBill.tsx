import React, { useRef, useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import { CopyOutlined } from '@ant-design/icons'
import { jsPDF } from 'jspdf'
import { Button } from 'antd'

const ExportHTMLToPDF = ({ getContentForExport, handleShowBill }) => {
	const ExportHTMLToPDF = () => {
		if (getContentForExport && getContentForExport.current) {
			html2canvas(getContentForExport.current).then((canvas) => {
				const pdf = new jsPDF('p', 'mm', 'a4')

				const imgData = canvas.toDataURL('image/png')
				pdf.addImage(imgData, 'PNG', 10, 22, 200, 180)
				pdf.save('Hoa_don_thanh_toan.pdf')
			})
			handleShowBill()
		}
	}

	return (
		<div>
			<Button
				onClick={() => ExportHTMLToPDF()}
				icon={<CopyOutlined />}
				style={{ border: '1px solid green' }}
			>
				Xuất ra file PDF
			</Button>
		</div>
	)
}

export default ExportHTMLToPDF
