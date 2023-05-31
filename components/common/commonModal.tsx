import React, { useEffect, useState } from 'react'
import { Alert, Avatar, Button, InputNumber, List, Modal, Space, Spin } from 'antd'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import Toasty from './toasty'
import { Label } from 'semantic-ui-react'
import SocketClient from './socketIoConnect'
import io from 'socket.io-client'
import { setMessage } from '@/redux/componentSlice/messageSocketSlice'
import { useDispatch } from 'react-redux'
interface inputProps {
	label: string
	tittle: string
	item: any
}
const CommonModal = (props: inputProps): JSX.Element => {
	// console.log(props.item)

	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [modalText, setModalText] = useState('Content of the modal')
	const dispatch = useDispatch()
	const showModal = () => {
		setOpen(true)
	}
	const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
		<Space>
			{React.createElement(icon)}
			{text}
		</Space>
	)
	const [socket, setSocket] = useState(null)
	// useEffect(() => {}, [])
	useEffect(() => {
		const newSocket = io('http://localhost:3500')
		setSocket(newSocket)

		return () => {
			newSocket.disconnect()
		}
	}, [])
	const handleOk = () => {
		setModalText('The modal will be closed after two seconds')
		setConfirmLoading(true)
		setTimeout(() => {
			setOpen(false)
			setConfirmLoading(false)
			// Toasty.success('Đặt món thành công')
			if (socket) {
				// Gửi sự kiện tới Socket.IO server
				socket.emit('myEvent', { message: 'Hello from client' })
				socket.on('response', async (response) => {
					await dispatch(setMessage(response))
					console.log('Received response:', response)
				})
			}
		}, 2000)
	}

	const handleCancel = () => {
		console.log('Clicked cancel button')
		setOpen(false)
	}
	const onChange = (value: number) => {
		console.log('changed', value)
	}
	return (
		<>
			<Button type="primary" onClick={showModal}>
				{props.label}
			</Button>
			<Modal
				title={confirmLoading ? '' : props.tittle}
				open={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				footer={[
					<Button key="2" onClick={handleCancel}>
						Hủy
					</Button>,
					<Button key="3" type="primary" loading={confirmLoading} onClick={handleOk}>
						Đặt ngay
					</Button>,
				]}
			>
				{confirmLoading ? (
					<Space direction="vertical" style={{ width: '100%' }}>
						<Space style={{ justifyContent: 'center', height: '200px', width: '100%' }}>
							<Spin tip="Vui lòng giữ màn hình đến khi nhân viên xác nhận"></Spin>
						</Space>
					</Space>
				) : (
					<List>
						<List.Item
							key={props.item.title}
							actions={[
								<IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
								<IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
							]}
						>
							<List.Item.Meta
								avatar={<Avatar src={props.item.avatar} />}
								title={<a href={props.item.href}>{props.item.title}</a>}
								description={props.item.description}
							/>
							{props.item.content}
						</List.Item>
						<Space>
							<h5>Nhập số lượng: </h5>
							<InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
						</Space>
					</List>
				)}
			</Modal>
		</>
	)
}

export default CommonModal
