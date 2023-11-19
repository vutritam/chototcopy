import React, { useState } from 'react'
import { Button, Modal } from 'antd'
interface inputProps {
	open: string
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
				onOk={(e) => handleModal(e, false, '')}
				onCancel={(e) => handleModal(e, false, '')}
			>
				{!items && 'chưa có data'}
			</Modal>
		</>
	)
}

export default CommonAddEmployee
