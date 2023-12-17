import React, { useCallback, useState } from 'react'
import { Button, Modal, Select, Space } from 'antd'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { fetchAllOrderByNumberTableAndLocationUser } from '@/redux/componentSlice/orderSlice'
interface inputProps {
	label?: string
	tittle?: string
	open: any
	idTable?: any
}
const ComfirmLocationOrder = (props: inputProps): JSX.Element => {
	const [dataInput, setDataInput] = useState({
		location: '',
	})
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

	const handleOk = async () => {
		props.handleShow()
		sessionStorage.setItem(
			'location_user',
			JSON.stringify({
				tableNumber: props.idTable,
				location: dataInput.location,
			})
		)
		await dispatch(
			fetchAllOrderByNumberTableAndLocationUser({
				tableNumber: props.idTable,
				location: dataInput.location,
			})
		)
		window.location.reload()
	}
	const onChangeLocation = useCallback(
		(label: any) => {
			setDataInput({ ...dataInput, location: label })
		},
		[dataInput]
	)
	const handleCancel = () => {
		// console.log('Clicked cancel button')
		// setOpen(false)
	}

	return (
		<>
			<Modal
				title={props.tittle}
				open={props.open}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key="3" type="primary" disabled={!dataInput.location} onClick={handleOk}>
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
						options={[
							{
								value: '409/99 Tân chánh hiệp 12 quận 12 TP.HCM',
								label: '409/99 Tân chánh hiệp 12 quận 12 TP.HCM',
							},
							{
								value: 'Trường chinh, tân bình',
								label: 'Trường chinh, tân bình',
							},
							{
								value: 'Hóc môn quận 12',
								label: 'Hóc môn quận 12',
							},
						]}
					/>
				</Space>
			</Modal>
		</>
	)
}

export default ComfirmLocationOrder
