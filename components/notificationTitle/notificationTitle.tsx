import React, { useEffect } from 'react'
import { BellOutlined } from '@ant-design/icons'
import { notification } from 'antd'
interface InputProps {
	message: string
	description: any
	icon?: any
}
const NotificationTitle = (props: InputProps) => {
	const { message, description, icon } = props
	const [api, contextHolder] = notification.useNotification()

	useEffect(() => {
		api.open({
			duration: 15,
			message: <h3>{message}</h3>,
			description: description,
			icon: !icon && <BellOutlined  style={{ color: '#108ee9' }} />,
		})
	}, [])

	return <>{contextHolder}</>
}

export default NotificationTitle
