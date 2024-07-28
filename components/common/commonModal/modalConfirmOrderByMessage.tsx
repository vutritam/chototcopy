import React, { useState } from 'react'
import { Button, Image, Modal } from 'antd'

interface InputProps {
	label: string
	title: string
	item?: any
}
const ModalCommonOrderByNumberTable: React.FC<InputProps> = (props) => {
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)

	const showModal = () => {
		setOpen(true)
	}

	const handleOk = () => {
		setConfirmLoading(true)
		setTimeout(() => {
			setOpen(false)
			setConfirmLoading(false)
		}, 2000)
	}

	const handleCancel = () => {
		console.log('Clicked cancel button')
		setOpen(false)
	}

	return (
		<>
			<Button type="primary" onClick={showModal}>
				{props.label}
			</Button>
			<Modal
				title={props.title}
				open={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				footer={[
					<Button key="3" type="primary" loading={confirmLoading} onClick={handleOk}>
						Tìm kiếm nhanh
					</Button>,
				]}
			>
				<p>
					{props.item?.map((ele: any, index: any) => (
						<div key={index}>
							<span>{ele.name}</span>
							<span>
								<Image
									width={60}
									height={60}
									style={{ borderRadius: '50px' }}
									alt="logo"
									src={process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/${ele.file}`}
								/>
							</span>
						</div>
					))}
				</p>
			</Modal>
		</>
	)
}

export default ModalCommonOrderByNumberTable
