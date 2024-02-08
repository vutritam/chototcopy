import List_manage_employee from '@/components/main/listManage_Employee'
import { getAllUserRequest } from '@/redux/componentSlice/userSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

function ManageRequest() {
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
	const [listUser, setListUser] = useState<React.Key[]>([])
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys)
	}

	useEffect(() => {
		const fetchDataUser = async () => {
			try {
				const { payload } = await dispatch(getAllUserRequest())

				if (payload?.success) {
					let filterUserUnRequest = payload.data.filter((item) => item.status !== '')
					setListUser(filterUserUnRequest)
				}
			} catch (error) {}
		}
		fetchDataUser()
	}, [])

	return (
		<div>
			<List_manage_employee item={listUser} IsPage="request" />
		</div>
	)
}
export default ManageRequest
