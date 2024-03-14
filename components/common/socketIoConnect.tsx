import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const useSocket = (endpoint) => {
	const [socket, setSocket] = useState(null)

	useEffect(() => {
		const newSocket = io(endpoint)
		setSocket(newSocket)

		return () => {
			newSocket.disconnect() // Ngắt kết nối khi component unmount
		}
	}, [endpoint])

	return socket
}

export default useSocket
