import React, { useEffect, useState } from 'react'
import { Alert, Avatar, Button, InputNumber, List, Modal, Space, Spin } from 'antd'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import Toasty from './toasty'
import { Label } from 'semantic-ui-react'
interface inputProps {
	label?: string
	tittle?: string
	open: any
}
const ComfirmLocationOrder = (props: inputProps): JSX.Element => {
	// console.log(props.item)

	// useEffect(() => {}, [])

	const handleOk = () => {
		// setModalText('The modal will be closed after two seconds')
		// setConfirmLoading(true)
		// setTimeout(() => {
		// 	setOpen(false)
		// 	setConfirmLoading(false)
		// 	// Toasty.success('Đặt món thành công')
		// 	if (socket) {
		// 		// Gửi sự kiện tới Socket.IO server
		// 		socket.emit('myEvent', { message: 'Hello from client' })
		// 		socket.on('response', async (response) => {
		// 			await dispatch(setMessage(response))
		// 			console.log('Received response:', response)
		// 		})
		// 	}
		// }, 2000)
	}

	const handleCancel = () => {
		// console.log('Clicked cancel button')
		// setOpen(false)
	}
	const onChange = (value: number) => {
		console.log('changed', value)
	}
	return (
		<>
			<Modal
				title={props.tittle}
				open={props.open}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key="2" onClick={handleCancel}>
						Hủy
					</Button>,
					<Button key="3" type="primary" onClick={handleOk}>
						Xác nhận
					</Button>,
				]}
			>
				<p>Vị trí aaaa</p>
			</Modal>
		</>
	)
}

export default ComfirmLocationOrder
