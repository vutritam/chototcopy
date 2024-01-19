import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'

interface inputProps {
	title: string
	position?: string
	open?: boolean
	item: any
	loading: boolean
	reason: string
	handleShow: () => void
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>
	handleSubmit?: () => void
	handleChangeReason?: () => void
	size?: number
}
const ModalConfirm = (props: inputProps): JSX.Element => {
	const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default')

	const onFormLayoutChange = ({ size }: { size: SizeType }) => {
		setComponentSize(size)
	}
	const { TextArea } = Input

	const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		console.log('Change:', e.target.value)
		props.handleChangeReason(e.target.value)
	}

	const handleOk = (isShow: Boolean) => {
		// props.handleSubmit()
		props.handleShow(isShow)
	}

	const renderComponent = () => {
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
				<div style={{ padding: '10px' }}>
					<TextArea
						showCount
						placeholder="Nhập lý do"
						maxLength={100}
						value={props.reason}
						onChange={onChange}
						style={{ width: '100%' }}
					/>
				</div>
			</Form>
		)
	}

	return (
		<>
			<Modal
				title={props.title}
				centered
				open={props.open}
				onOk={() => handleOk(false)}
				onCancel={() => props.handleShow(false)}
				okButtonProps={{ disabled: !props.reason }}
				width={props.size}
				confirmLoading={props.loading}
			>
				{renderComponent()}
			</Modal>
		</>
	)
}

export default ModalConfirm
