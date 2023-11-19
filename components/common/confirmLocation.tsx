import React, { useCallback, useState } from 'react'
import { Button, Modal, Select, Space } from 'antd'
// import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
// import Toasty from './toasty'
// import { Label } from 'semantic-ui-react'
interface inputProps {
	label?: string
	tittle?: string
	open: any
}
const ComfirmLocationOrder = (props: inputProps): JSX.Element => {
	const [dataInput, setDataInput] = useState({
		tableNumber: 0,
		location: '',
	})

	const handleOk = () => {
		props.handleShow()
		sessionStorage.setItem(
			'location_user',
			JSON.stringify({
				tableNumber: dataInput.tableNumber,
				location: dataInput.location,
			})
		)
		// setModalText('The modal will be closed after two seconds')
		// setConfirmLoading(true)
		// setTimeout(() => {
		// 	setOpen(false)
		// 	setConfirmLoading(false)
		// 	// Toasty.success('Đặt món thành công')
		// 	if (socket) {
		// 		// Gửi sự kiện tới Socket.IO server
		// 		socket.emit('myEvent', { message: 'Hello from client' })
		// 		socket.on('response', async (response) => {
		// 			await dispatch(setMessage(response))
		// 			console.log('Received response:', response)
		// 		})
		// 	}
		// }, 2000)
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
