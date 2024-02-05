// employee.tsx
import React, { useState } from 'react'
import QRcode from '@/components/QRcode/qrCode'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { Button } from 'antd'

interface Props {}

const ListQrCode: React.FC<Props> = () => {
	const router = useRouter()
	return (
		<div>
			<div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
				<ArrowLeftOutlined onClick={() => router.back()} />
				<h3 style={{ margin: 0 }}>Danh sách toàn bộ QR code bàn số {router.query.qrcode}</h3>
				<Button type="primary">In danh sách</Button>
			</div>
			<div style={{ marginTop: '15px' }}>
				create about post with 65 param [...paramids]
				<p>Queries: {JSON.stringify(router.query)}</p>
			</div>
		</div>
	)
}

export default ListQrCode
