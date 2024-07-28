import React from 'react'
import { Modal } from 'antd'
interface inputProps {
	open: boolean
	handleModal?: (e: any, value: boolean, title: string) => void
	title: string
	items?: any
}
const CommonAddEmployee = (props: inputProps): JSX.Element => {
	const { open, title, handleModal, items } = props
	return (
		<>
			<Modal
				title={title}
				centered
				open={open}
				onOk={(e) => handleModal && handleModal(e, false, '')}
				onCancel={(e) => handleModal && handleModal(e, false, '')}
			>
				{!items && 'chưa có data'}
			</Modal>
		</>
	)
}

export default CommonAddEmployee
