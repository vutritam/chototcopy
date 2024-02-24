// employee.tsx
import { Button, Form, Input } from 'antd'
import React, { useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Label } from 'semantic-ui-react'

interface PaymentProps {}

const PaymentOrder: React.FC<PaymentProps> = () => {
	const initialValues = {
		ordertype: 'billpayment',
		Amount: 0,
		OrderDescription: '',
		bankcode: null,
		language: '',
	}
	const [dataSubmit, setDataSubmit] = useState(initialValues)
	const onSubmitData = (data) => {
		const formData = new FormData()
		formData.append('name', dataSubmit?.ordertype)
		formData.append('price', data.Amount)
		formData.append('quantity', data.OrderDescription)
		formData.append('Description', data.bankcode)
		formData.append('EndDate', data.language)

		// setDataSubmit({ ...data, ordertype: dataSubmit?.ordertype })
	}

	const renderFormPayment = () => (
		<div>
			<h3 style={{ marginBottom: '40px' }}>Thanh toán online</h3>
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{ remember: true }}
				onFinish={onSubmitData}
			>
				<Form.Item name="ordertype" label={<Label content="Loại hàng hóa" />}>
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="billpayment"
						value={'billpayment'}
						disabled
					/>
				</Form.Item>
				<Form.Item
					name="Amount"
					rules={[{ required: true, message: 'Please input your Password!' }]}
					label={<Label content="Số tiền" />}
				>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="number"
						placeholder="Số tiền"
					/>
				</Form.Item>
				<Form.Item
					name="OrderDescription"
					rules={[{ required: true, message: 'Please input your Password!' }]}
					label={<Label content="Nội dung thanh toán" />}
				>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="text"
						placeholder="Nội dung thanh toán"
					/>
				</Form.Item>

				<Form.Item
					name="bankcode"
					rules={[{ required: true, message: 'Please input your Password!' }]}
					label={<Label content="Ngân hàng" />}
				>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="text"
						placeholder="Ngân hàng"
					/>
				</Form.Item>

				<Form.Item
					name="language"
					rules={[{ required: true, message: 'Please input your Password!' }]}
					label={<Label content="Ngôn ngữ" />}
				>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="text"
						placeholder="Ngôn ngữ"
					/>
				</Form.Item>
				<Form.Item>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Button
							type="primary"
							htmlType="submit"
							// loading={loadings}
							className="login-form-button"
							// onClick={onSubmitData}
						>
							Thanh toán
						</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	)

	return <>{renderFormPayment()}</>
}

export default PaymentOrder
