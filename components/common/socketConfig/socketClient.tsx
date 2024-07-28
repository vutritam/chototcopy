import { useState, useEffect } from 'react'
import io, { Socket } from 'socket.io-client'
// Explicitly define Socket type

const useSocket = (endpoint: string) => {
	const [socket, setSocket] = useState<Socket | null>(null)

	useEffect(() => {
		const newSocket: any = io(endpoint)
		setSocket(newSocket)

		return () => newSocket.disconnect()
	}, [endpoint])

	return socket
}

export default useSocket
