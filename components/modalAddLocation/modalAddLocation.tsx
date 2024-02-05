import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Space, Spin } from 'antd'
import { FileAddOutlined, UserOutlined } from '@ant-design/icons'
import { Label } from 'semantic-ui-react'
import L10N from '../../L10N/en.json'

interface inputProps {
	label: string
	title: string
	dataLocation: any
	onChangeDataLocation: any
	onFinish: any
}

const ModalAddLocation = (props: inputProps): JSX.Element => {
	const { label, title, dataLocation, onChangeDataLocation, onFinish } = props
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)

	const showModal = () => {
		setOpen(true)
	}

	const handleOk = () => {
		// setTimeout(async () => {
		setOpen(false)

		setConfirmLoading(false)
	}

	const handleCancel = () => {
		setOpen(false)
	}

	const renderFormAddLocation = () => {
		return (
			<Form name="normal_login" className="login-form" initialValues={{ remember: true }}>
				<Form.Item
					required
					name="newPassword"
					rules={[{ required: true, message: 'Please input your mật khẩu!' }]}
					label={<Label content="Địa điểm" />}
				>
					<Input
						onChange={(e) => onChangeDataLocation('nameLocation', e?.target?.value)}
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Nhập địa điểm"
					/>
				</Form.Item>
				<Form.Item
					name="password"
					required
					rules={[{ required: true, message: 'Please input your mật khẩu!' }]}
					label={<Label content="Số lượng nhân viên" />}
				>
					<Input
						type="number"
						min={1}
						value={1}
						max={20}
						onChange={(e) => onChangeDataLocation('quantityEmployee', e?.target?.value)}
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Nhập số lượng nhân viên tối đa"
					/>
				</Form.Item>
			</Form>
		)
	}

	return (
		<>
			<Button type="default" onClick={showModal} icon={<FileAddOutlined />}>
				{label}
			</Button>
			<Modal
				title={confirmLoading ? '' : <p style={{ color: 'blue' }}>{title}</p>}
				open={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				footer={[
					<Button key="2" onClick={handleCancel}>
						Hủy
					</Button>,
					<Button
						key="3"
						type="primary"
						loading={confirmLoading}
						onClick={onFinish}
						disabled={!dataLocation}
					>
						Xác nhận
					</Button>,
				]}
			>
				{confirmLoading ? (
					<Space direction="vertical" style={{ width: '100%' }}>
						<Space style={{ justifyContent: 'center', height: '200px', width: '100%' }}>
							<Spin tip={L10N['commonTable.confirmModal.title']}></Spin>
						</Space>
					</Space>
				) : (
					renderFormAddLocation()
				)}
			</Modal>
		</>
	)
}

export default ModalAddLocation
