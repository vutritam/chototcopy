import React, { useEffect, useState } from 'react'
import { Badge, Menu } from 'antd'
import { getAllUserRequest, setAcceptRequestUsers } from '@/redux/componentSlice/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
interface inputProps {
	icon: React.ReactNode
}

// Sử dụng CustomMenu
const HelperMenu = (props: inputProps) => {
	const { icon } = props
	const userListAcceptRequestUsers = useSelector((state: any) => state.user.isAcceptRequestUsers)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	useEffect(() => {
		;(async () => {
			const { payload } = await dispatch(getAllUserRequest())
			if (payload.success) {
				await dispatch(setAcceptRequestUsers(payload.data))
			}
		})()
	}, [])

	return (
		<div style={{ marginRight: '5px' }}>
			{userListAcceptRequestUsers.data.filter((item) => item.status === 'request_pending').length <=
			0 ? (
				icon
			) : (
				<Badge
					count={
						userListAcceptRequestUsers.data.filter((item) => item.status === 'request_pending')
							.length
					}
				/>
			)}
		</div>
	)
}

export default HelperMenu
