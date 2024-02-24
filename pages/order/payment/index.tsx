// employee.tsx
import PaymentOrder from '@/components/payment'
import React, { useState } from 'react'

interface EmployeeProps {}

const OrderPaymentPage: React.FC<EmployeeProps> = () => {
	return <PaymentOrder />
}

export default OrderPaymentPage
