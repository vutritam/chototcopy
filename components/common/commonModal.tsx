import React, { useEffect, useState } from 'react'
import { Alert, Avatar, Button, InputNumber, List, Modal, Select, Space, Spin } from 'antd'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import Toasty from './toasty'
import { Label } from 'semantic-ui-react'
import SocketClient from './socketIoConnect'
import io from 'socket.io-client'
import { setMessage } from '@/redux/componentSlice/messageSocketSlice'
import { useDispatch } from 'react-redux'
import { fetchCreateOrder, setOrder } from '@/redux/componentSlice/orderSlice'
import { fetchCreateProduct } from '@/redux/componentSlice/productSlice'
import { useRouter } from 'next/router'
import { decodeNumber, encodeNumber } from './hashCode'

interface inputProps {
	label: string
	tittle: string
	item: any
}
const CommonModal = (props: inputProps): JSX.Element => {
	// console.log(props.item)
	const [idTable, setIdTable] = useState<any>(0)
	let router = useRouter()
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [dataInput, setDataInput] = useState({
		quantity: 1,
		location: '',
	})
	const [modalText, setModalText] = useState('Content of the modal')
	const dispatch = useDispatch()
	const showModal = () => {
		setOpen(true)
	}
	const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
		<Space>
			{React.createElement(icon)}
			{text}
		</Space>
	)
	const [socket, setSocket] = useState(null)
	// useEffect(() => {}, [])
	useEffect(() => {
		const newSocket = io('http://localhost:3500')
		setSocket(newSocket)

		return () => {
			newSocket.disconnect()
		}
	}, [])

	useEffect(() => {
		// setLoading(true)
		let num = router?.query?.order || null // c0
		let convert
		if (isNaN(num)) {
			const [decoded, originalNum] = decodeNumber(num)
			convert = decoded
		} else {
			convert = encodeNumber(Number(num))
		}
		setIdTable(convert)
	}, [router?.query])

	const handleOk = () => {
		setModalText('The modal will be closed after two seconds')
		setConfirmLoading(true)
		setTimeout(async () => {
			setOpen(false)
			setDataInput({
				quantity: 0,
				location: '',
			})
			setConfirmLoading(false)
			const { payload } = await dispatch(
				fetchCreateOrder({
					tableNumber: idTable,
					productId: props.item.id,
					location: dataInput.location,
					quantity: dataInput.quantity,
				})
			)
			if (payload?.success) {
				if (socket) {
					// gửi sự kiện get sản phẩm
					socket.emit('getProductOrder', {
						message: 'Gửi sự kiện lấy sản phẩm',
						location: dataInput.location,
					})
				}
			}

			if (socket) {
				// Gửi sự kiện tới Socket.IO server
				socket.emit('myEvent', { message: 'Hello from client' })
				socket.on('response', async (response) => {
					await dispatch(setMessage(response))
					localStorage.setItem('notification', JSON.stringify(response))
					console.log('Received response:', response)
				})
			}
			// Toasty.success('Đặt món thành công')
		}, 2000)
	}

	const handleCancel = () => {
		console.log('Clicked cancel button')
		setOpen(false)
		setDataInput({
			quantity: 0,
			location: '',
		})
	}

	const onChangeQuantity = (value: any) => {
		setDataInput({ ...dataInput, quantity: value })
	}
	const onChangeLocation = (label: any) => {
		setDataInput({ ...dataInput, location: label })
	}
	console.log('changed', {
		tableNumber: idTable,
		productId: props.item.id,
		location: dataInput.location,
		quantity: dataInput.quantity,
	})
	return (
		<>
			<Button type="primary" onClick={showModal}>
				{props.label}
			</Button>
			<Modal
				title={confirmLoading ? '' : <p style={{ color: 'blue' }}>{props.tittle}</p>}
				open={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				footer={[
					<Button key="2" onClick={handleCancel}>
						Hủy
					</Button>,
					<Button
						key="3"
						type="primary"
						loading={confirmLoading}
						onClick={handleOk}
						disabled={!dataInput.location || dataInput.quantity <= 0}
					>
						Đặt ngay
					</Button>,
				]}
			>
				{confirmLoading ? (
					<Space direction="vertical" style={{ width: '100%' }}>
						<Space style={{ justifyContent: 'center', height: '200px', width: '100%' }}>
							<Spin tip="Vui lòng giữ màn hình đến khi nhân viên xác nhận"></Spin>
						</Space>
					</Space>
				) : (
					<List>
						<List.Item
							key={props.item.id}
							actions={[
								<IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
								<IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
							]}
						>
							<List.Item.Meta
								avatar={<Avatar src={`http://localhost:3000/images/${props.item.file}`} />}
								title={props.item.name}
								description={props.item.Description}
							/>
							{props.item.Description}
						</List.Item>
						<Space>
							<h5>Nhập số lượng: </h5>
							<InputNumber min={1} max={10} defaultValue={1} onChange={onChangeQuantity} />
						</Space>
						<Space style={{ marginTop: '5px' }}>
							<h5>Nhập vị trí: </h5>
							<Select
								showSearch
								style={{ width: 200 }}
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
					</List>
				)}
			</Modal>
		</>
	)
}

export default CommonModal
