import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const useSocket = (endpoint: string) => {
	const [socket, setSocket] = useState(null)

	useEffect(() => {
		const newSocket: any = io(endpoint)
		setSocket(newSocket)

		return () => {
			newSocket.disconnect() // Ngắt kết nối khi component unmount
		}
	}, [endpoint])

	return socket
}

export default useSocket
