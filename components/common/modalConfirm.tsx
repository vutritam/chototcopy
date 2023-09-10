import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Select, Space, Spin, TreeSelect } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'

interface inputProps {
	label: string
	title: string
	position?: string
	open?: boolean
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>
	handleSubmit?: () => void
	size?: number
}
const ModalConfirm = (props: inputProps): JSX.Element => {
	// const [open, setOpen] = useState(false)
	const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default')

	const onFormLayoutChange = ({ size }: { size: SizeType }) => {
		setComponentSize(size)
	}
	const { TextArea } = Input

	const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		// console.log('Change:', e.target.value)
	}

	const renderDeleteItemOrder = () => {
		return (
			<Space direction="vertical" style={{ width: '100%' }}>
				<Space style={{ justifyContent: 'center', height: '100px', width: '100%' }}>
					<Spin tip="Xác nhận xóa?"></Spin>
				</Space>
			</Space>
		)
	}

	const handleOk = (isShow: Boolean) => {
		props.handleSubmit()
		props.setOpen(isShow)
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

	const handleRender = () => {
		return renderItem(props.position || undefined)
	}

	const renderItem = (position: string) => {
		switch (position) {
			case 'renderComfirmThu':
				return renderThu()
			case 'renderConfirmDeleteItemOrder':
				return renderDeleteItemOrder()
			default:
				break
		}
	}

	useEffect(() => {
		handleRender()
		// renderItem()
	}, [])

	return (
		<>
			<p onClick={() => props.setOpen(true)}>{props.label}</p>
			<Modal
				title={props.title}
				centered
				open={props.open}
				onOk={() => handleOk(false)}
				onCancel={() => props.setOpen(false)}
				width={props.size}
			>
				{handleRender()}
			</Modal>
		</>
	)
}

export default ModalConfirm
