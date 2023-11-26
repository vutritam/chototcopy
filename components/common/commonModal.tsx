import React, { useEffect, useState } from 'react'
import { Avatar, Button, InputNumber, List, Modal, Select, Space, Spin, Tooltip } from 'antd'
import { LikeOutlined, MessageOutlined } from '@ant-design/icons'
import Toasty from './toasty'
import { Label, TextArea } from 'semantic-ui-react'
import SocketClient from './socketIoConnect'
import io from 'socket.io-client'
import { setMessage, setMessageEmployee } from '@/redux/componentSlice/messageSocketSlice'
import { useDispatch } from 'react-redux'
import { fetchCreateOrder, setOrder } from '@/redux/componentSlice/orderSlice'
import { fetchCreateProduct } from '@/redux/componentSlice/productSlice'
import { useRouter } from 'next/router'
import { decodeNumber, encodeNumber } from './hashCode'
import { processRouterQuery } from './parseNumber'
import L10N from '../L10N/en.json'
import { ThunkDispatch } from '@reduxjs/toolkit'

interface inputProps {
	label: string
	tittle: string
	item: any
}
const CommonModal = (props: inputProps): JSX.Element => {
	const [idTable, setIdTable] = useState<any>(0)
	let router = useRouter()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const isOrderPage = router.pathname.startsWith('/order')
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [getLocationOrderUser, setGetLocationOrderUser] = useState(null)
	const [dataInput, setDataInput] = useState({
		quantity: 1,
		description: '',
	})

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

	useEffect(() => {
		if (
			sessionStorage.getItem('location_user') !== null ||
			sessionStorage.getItem('user') !== null
		) {
			setGetLocationOrderUser(JSON.parse(sessionStorage.getItem('location_user')))
		}
	}, [open])
	useEffect(() => {
		const ENV_HOST = process.env.NEXT_PUBLIC_HOST
		const newSocket = io(ENV_HOST)
		setSocket(newSocket)

		return () => {
			newSocket.disconnect()
		}
	}, [])

	useEffect(() => {
		// setLoading(true)
		const convertedValue = processRouterQuery(router?.query)
		setIdTable(convertedValue)
	}, [router?.query])

	const handleOk = () => {
		setConfirmLoading(true)
		setTimeout(async () => {
			setOpen(false)
			setDataInput({
				quantity: 0,
				description: '',
			})
			setConfirmLoading(false)
			const { payload } = await dispatch(
				fetchCreateOrder({
					tableNumber: idTable,
					productId: props.item.id,
					location: getLocationOrderUser?.location,
					quantity: dataInput.quantity,
					description: dataInput.description,
				})
			)
			if (payload?.success) {
				if (socket) {
					// gửi sự kiện get sản phẩm
					socket.emit('getProductOrder', {
						message: 'Gửi sự kiện lấy sản phẩm',
						location: getLocationOrderUser?.location,
					})
				}
			}

			if (socket) {
				// let getUserId = isOrderPage ? null : getLocationEmployee?.data?.userId
				// Gửi sự kiện tới Socket.IO server
				socket.emit('myEvent', {
					message: 'Hello from client',
					tableNumber: idTable,
					location: getLocationOrderUser?.location,
					productId: props.item.id,
					userId: null,
					isPage: 'user_order',
				})
				socket.on('response', async (response) => {
					await dispatch(setMessage(response))

					localStorage.setItem('notification', JSON.stringify(response))
				})
			}
			// Toasty.success('Đặt món thành công')
		}, 2000)
	}

	const handleCancel = () => {
		setOpen(false)
		setDataInput({
			quantity: 0,
			description: '',
		})
	}

	const onChangeQuantity = (value: any) => {
		setDataInput({ ...dataInput, quantity: value })
	}

	const onChangeDescription = (event: any) => {
		setDataInput({ ...dataInput, description: event?.target?.value })
	}

	return (
		<>
			<Button type="default" className="button-styles" onClick={showModal}>
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
						disabled={!getLocationOrderUser?.location || dataInput.quantity <= 0}
					>
						Đặt ngay
					</Button>,
				]}
			>
				{confirmLoading ? (
					<Space direction="vertical" style={{ width: '100%' }}>
						<Space style={{ justifyContent: 'center', height: '200px', width: '100%' }}>
							<Spin tip={L10N['commonTable.confirmModal.title']}></Spin>
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
								description={
									<div
										style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
									>
										<Tooltip placement="top" title={props.item.Description}>
											{props.item.Description}
										</Tooltip>
									</div>
								}
							/>
						</List.Item>
						<Space>
							<h5>Nhập số lượng: </h5>
							<InputNumber
								min={1}
								max={10}
								defaultValue={1}
								value={dataInput.quantity}
								onChange={onChangeQuantity}
							/>
						</Space>
						<div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: '5px' }}>
							<h5 style={{ margin: 0 }}>Nơi đặt: </h5>
							<Select
								showSearch
								style={{ width: 200 }}
								placeholder="Search to Select"
								optionFilterProp="children"
								disabled
								value={getLocationOrderUser?.location}
								filterOption={(input, option) => (option?.label ?? '').includes(input)}
								filterSort={(optionA, optionB) =>
									(optionA?.label ?? '')
										.toLowerCase()
										.localeCompare((optionB?.label ?? '').toLowerCase())
								}
								// options={[
								// 	{
								// 		value: '409/99 Tân chánh hiệp 12 quận 12 TP.HCM',
								// 		label: '409/99 Tân chánh hiệp 12 quận 12 TP.HCM',
								// 	},
								// 	{
								// 		value: 'Trường chinh, tân bình',
								// 		label: 'Trường chinh, tân bình',
								// 	},
								// 	{
								// 		value: 'Hóc môn quận 12',
								// 		label: 'Hóc môn quận 12',
								// 	},
								// ]}
							/>
						</div>
						<div style={{ marginTop: 10 }}>
							<h5>Ghi chú (Không bắt buộc): </h5>
							<TextArea
								showCount
								maxLength={100}
								style={{
									height: 120,
									marginBottom: 24,
									width: '100%',
									border: '1px solid #dfdada',
									padding: 5,
								}}
								onChange={onChangeDescription}
								placeholder="Ghi chú cho nhân viên"
							/>
						</div>
					</List>
				)}
			</Modal>
		</>
	)
}

export default CommonModal
