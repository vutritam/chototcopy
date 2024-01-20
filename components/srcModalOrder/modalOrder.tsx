import React, { useEffect, useState } from 'react'
import { Avatar, Button, InputNumber, List, Modal, Select, Space, Spin, Tooltip } from 'antd'
import { LikeOutlined, MessageOutlined } from '@ant-design/icons'
import { TextArea } from 'semantic-ui-react'
import io from 'socket.io-client'
import { useRouter } from 'next/router'
import { processRouterQuery } from '../common/parseNumber'
import L10N from '../../L10N/en.json'

interface inputProps {
	label: string
	tittle: string
	item: any
}
const CommonModal = (props: inputProps): JSX.Element => {
	const [idTable, setIdTable] = useState<any>(0)
	let router = useRouter()
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
		// setTimeout(async () => {
		setOpen(false)

		setConfirmLoading(false)
		if (socket) {
			// Gửi sự kiện tới Socket.IO server
			socket.emit('myEvent', {
				tableNumber: idTable,
				productId: props.item.id,
				location: getLocationOrderUser?.location,
				quantity: dataInput.quantity,
				description: dataInput.description,
				status: 'order_inprogess',
			})

			socket.emit('getProductOrder', {
				message: 'Gửi sự kiện lấy sản phẩm',
				location: getLocationOrderUser?.location,
			})
		}
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
		console.log(event?.target?.value, 'event?.target?.value')

		setDataInput({ ...dataInput, description: event?.target?.value })
	}

	return (
		<>
			<Button type="default" onClick={showModal}>
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
