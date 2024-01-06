import { Button, Input } from 'antd'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { SendOutlined } from '@ant-design/icons'
import MasterLayout from '@/components/masterLayout/masterLayout'
import { itemsEmployee } from '@/components/jsonData/menuData'
import PrivateRoute from '@/components/common/privateRoute'
const socket = io('http://localhost:3000')

function ChatApp() {
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')

	useEffect(() => {
		socket.on('message', (messageData) => {
			setMessages((prevMessages) => [...prevMessages, messageData])
		})
	}, [socket])

	const sendMessage = () => {
		socket.emit('chatMessage', { text: newMessage })
		setNewMessage('')
	}

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '10px',
				display: 'flex',
				width: '90%',
				justifyContent: 'center',
				gap: '5px',
			}}
		>
			<div>
				{messages.map((message, index) => (
					<div key={index}>{message.text}</div>
				))}
			</div>
			<Input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
			<Button onClick={sendMessage}>
				<SendOutlined />
			</Button>
		</div>
	)
}

export default ChatApp
