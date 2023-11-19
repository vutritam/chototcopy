import { useEffect } from 'react'
import io from 'socket.io-client'

const SocketClient: React.FC = ({ setSocket }) => {
	useEffect(() => {
		const ENV_HOST = process.env.NEXT_PUBLIC_HOST
		const newSocket = io(ENV_HOST)
		setSocket(newSocket)

		return () => {
			newSocket.disconnect()
		}
	}, [])

	return null
}

export default SocketClient
