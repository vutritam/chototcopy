// employee.tsx
import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import axiosConfig from '../../pages/api/axiosConfigs'
import QRCode from 'react-qr-code'
interface Props {}

const ListQrCode: React.FC<Props> = () => {
	const router = useRouter()
	const [dataQR, setData] = useState<Array<object>>([])

	useEffect(() => {
		const { qrcode } = router.query
		const getAllQrCodeByLocationId = async () => {
			if (qrcode && qrcode[0]) {
				try {
					const { data } = await axiosConfig.post(`/qrcode/getAllQrCodeByIdLocation/${qrcode[0]}`)
					if (data?.success) {
						setData(data?.data)
					}
				} catch (error) {
					console.error('Error fetching data:', error)
				}
			}
		}
		getAllQrCodeByLocationId()
	}, [router.query.qrcode])

	return (
		<div>
			<div
				style={{
					display: 'flex',
					gap: '6px',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
					<ArrowLeftOutlined onClick={() => router.back()} />
					<div>
						<h3 style={{ margin: 0 }}>Danh sách toàn bộ QR code</h3>
					</div>
				</div>
				<Button type="primary">In danh sách</Button>
			</div>
			<div
				style={{
					display: 'flex',
					width: '100%	',
					flexWrap: 'wrap',
					gap: '10px',
					marginTop: '10px',
				}}
			>
				{dataQR?.map((e, index) => (
					<div key={index}>
						<h2>Bàn số: {e?.tableNumber}</h2>
						<div>Code: {e?.code}</div>
						<QRCode
							key={index}
							value={process.env.NEXT_PUBLIC_HOST_CLIENT + '/order/' + e?.code}
							size={100}
						/>
						<br />
					</div>
				))}
			</div>
		</div>
	)
}

export default ListQrCode
