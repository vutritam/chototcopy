import { useEffect } from 'react'
import io from 'socket.io-client'

const SocketClient: React.FC = () => {
	useEffect(() => {
		const socket = io('http://localhost:3000') // Thay đổi URL và cổng của máy chủ Socket.IO nếu cần thiết

		// Gửi dữ liệu tới máy chủ Socket.IO
		socket.emit('message', 'Hello, Server!')

		// Nhận dữ liệu từ máy chủ Socket.IO
		socket.on('message', (data) => {
			console.log('Received message from server:', data)
		})

		return () => {
			socket.disconnect() // Ngắt kết nối Socket.IO khi component bị hủy
		}
	}, [])

	return null
}

export default SocketClient
