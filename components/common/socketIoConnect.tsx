import { useEffect } from 'react'
import io from 'socket.io-client'

const SocketClient: React.FC = ({ setSocket }) => {
	useEffect(() => {
		const newSocket = io('http://localhost:3500')
		setSocket(newSocket)

		return () => {
			newSocket.disconnect()
		}
	}, [])

	return null
}

export default SocketClient
