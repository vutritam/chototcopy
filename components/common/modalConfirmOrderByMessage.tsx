import React, { useState } from 'react'
import { Button, Image, Modal } from 'antd'

interface inputProps {
	label: string
	title: string
	item?: any
}
const ModalCommonOrderByNumberTable: React.FC = (props: inputProps) => {
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [modalText, setModalText] = useState('Content of the modal')

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
					<Button
						key="3"
						type="primary"
						loading={confirmLoading}
						onClick={handleOk}
						// disabled={!getLocationOrderUser?.location || dataInput.quantity <= 0}
					>
						Tìm kiếm nhanh
					</Button>,
				]}
			>
				<p>
					{props.item?.map((ele, index) => (
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
