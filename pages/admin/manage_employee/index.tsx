// import ListItem from '@/components/main/listItem'
// import ManageMoney from '@/components/main/manageMoney'
import PrivateRoute from '@/components/common/privateRoute'
import { itemsAdmin } from '@/components/jsonData/menuData'
import List_manage_employee from '@/components/main/listManage_Employee'
import MasterLayout from '@/components/masterLayout/masterLayout'
import { fetchAllUser } from '@/redux/componentSlice/userSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { Dropdown, Space, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import ListItem from './listItem'
// import ManageMoney fro'

type Props = {}
interface DataType {
	key: React.Key
	name: string
	age: number
	address: string
}
function ManageEmployee({}: Props) {
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
	const [listUser, setListUser] = useState<React.Key[]>([])
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys)
	}

	useEffect(() => {
		const fetchDataUser = async () => {
			try {
				const { payload } = await dispatch(fetchAllUser())
				if (payload) {
					setListUser(payload)
				}
			} catch (error) {}
		}
		fetchDataUser()
	}, [])

	return (
		<div>
			<List_manage_employee item={listUser} />
		</div>
	)
}
export default ManageEmployee
