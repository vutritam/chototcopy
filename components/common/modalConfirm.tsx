import React, { useState } from 'react'
import { Button, Form, Input, Modal, Select, TreeSelect } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'

interface inputProps {
	label: string
	title: string
}
const ModalConfirm = (props: inputProps): JSX.Element => {
	const [open, setOpen] = useState(false)
	const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default')

	const onFormLayoutChange = ({ size }: { size: SizeType }) => {
		setComponentSize(size)
	}
	const { TextArea } = Input

	const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		console.log('Change:', e.target.value)
	}

	const renderThu = () => {
		return (
			<Form
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 14 }}
				layout="horizontal"
				initialValues={{ size: componentSize }}
				onValuesChange={onFormLayoutChange}
				size={componentSize as SizeType}
				// style={{ maxWidth: 600 }}
			>
				<Form.Item label="Số tiền">
					<Input placeholder="Số tiền" />
				</Form.Item>
				<Form.Item label="Nghiệp vụ">
					<Select placeholder="Nghiệp vụ">
						<Select.Option value="demo">Demo</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item label="Cách thanh toán">
					<Select placeholder="Phương thức thanh toán">
						<Select.Option value="demo">Demo</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item label="Lý do">
					<TextArea showCount maxLength={100} onChange={onChange} />
				</Form.Item>
				<Form.Item>
					<Button>Lưu</Button>
				</Form.Item>
			</Form>
		)
	}

	return (
		<>
			<p onClick={() => setOpen(true)}>{props.label}</p>
			<Modal
				title={props.title}
				centered
				open={open}
				onOk={() => setOpen(false)}
				onCancel={() => setOpen(false)}
				width={1000}
			>
				{renderThu()}
			</Modal>
		</>
	)
}

export default ModalConfirm
