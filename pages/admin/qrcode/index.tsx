// employee.tsx
import React, { useState } from 'react'
import QRcode from '@/components/QRcode/qrCode'

interface AdminProps {}

const QRCodePage: React.FC<AdminProps> = () => {
	return <QRcode />
}

export default QRCodePage
