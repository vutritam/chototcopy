import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal, Select, Space } from 'antd'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { fetchAllOrderByNumberTableAndLocationUser } from '@/redux/componentSlice/orderSlice'
import Toasty from '../common/toasty'
import axiosConfig from '../../pages/api/axiosConfigs'
import _ from 'lodash'

interface inputProps {
	label?: string
	tittle?: string
	open: any
	idTable?: any
}
const ComfirmLocationOrder = (props: inputProps): JSX.Element => {
	const [dataInput, setDataInput] = useState({
		locationId: '',
	})
	const [listLocation, setListLocation] = useState([])
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

	const handleOk = async () => {
		props.handleShow()

		sessionStorage.setItem(
			'location_user',
			JSON.stringify({
				tableNumber: props.idTable,
				locationId: dataInput.locationId,
			})
		)
		await dispatch(
			fetchAllOrderByNumberTableAndLocationUser({
				tableNumber: props.idTable,
				locationId: dataInput.locationId,
			})
		)
		// window.location.reload()
	}

	const onChangeLocation = useCallback(
		(value: any) => {
			setDataInput({ ...dataInput, locationId: value })
		},
		[dataInput]
	)

	const handleCancel = () => {
		// console.log('Clicked cancel button')
		// setOpen(false)
	}

	useEffect(() => {
		const fetchData = async () => {
			let response = await axiosConfig.get(`/location/getAllLocation`)

			if (response.data.success) {
				const countByClass = _.map(response.data.data, (location) => ({
					value: location?._id,
					label: location?.nameLocation,
				}))
				setListLocation(countByClass)
			} else {
				Toasty.error(response.data.message)
			}
		}
		fetchData()
	}, [])

	return (
		<>
			<Modal
				title={props.tittle}
				open={props.open}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key="3" type="primary" disabled={!dataInput.locationId} onClick={handleOk}>
						Xác nhận
					</Button>,
				]}
			>
				<Space style={{ marginTop: '5px' }}>
					<h5>Nơi đặt: </h5>
					<Select
						showSearch
						style={{ width: '100%' }}
						placeholder="Search to Select"
						optionFilterProp="children"
						onChange={onChangeLocation}
						filterOption={(input, option) => (option?.label ?? '').includes(input)}
						filterSort={(optionA, optionB) =>
							(optionA?.label ?? '')
								.toLowerCase()
								.localeCompare((optionB?.label ?? '').toLowerCase())
						}
						options={listLocation}
					/>
				</Space>
			</Modal>
		</>
	)
}

export default ComfirmLocationOrder
