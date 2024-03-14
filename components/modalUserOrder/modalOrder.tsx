import React, { useEffect, useState } from 'react'
import { Avatar, Button, InputNumber, List, Modal, Select, Space, Spin, Tooltip } from 'antd'
import { LikeOutlined, MessageOutlined } from '@ant-design/icons'
import { TextArea } from 'semantic-ui-react'
import io from 'socket.io-client'
import axiosConfig from '../../pages/api/axiosConfigs'
import L10N from '../../L10N/en.json'
import Toasty from '../common/toasty'
import useSocket from '../common/socketConfig/socketClient'

interface inputProps {
	label: string
	tittle: string
	item: any
	type: string
	styles?: string
}
const CommonModal = (props: inputProps): JSX.Element => {
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [dataItem, setDataItem] = useState<any>({})
	const [getLocationOrderUser, setGetLocationOrderUser] = useState({})
	const [dataInput, setDataInput] = useState({
		quantity: props.type === 'changeOrder' ? props?.item?.quantity : 1,
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
	const fetchLocation = async () => {
		const locationUser = JSON.parse(sessionStorage.getItem('location_user'))
		let response = await axiosConfig.post(`/location/getLocationById/${locationUser?.locationId}`)

		if (response.data.success) {
			setGetLocationOrderUser({
				tableNumber: locationUser?.tableNumber,
				location: response.data.data,
			})
		} else {
			Toasty.error(response.data.message)
		}
	}

	useEffect(() => {
		if (
			sessionStorage.getItem('location_user') !== null ||
			sessionStorage.getItem('user') !== null
		) {
			fetchLocation()
			const convertDataCommon = props.type === 'changeOrder' ? props.item.productId : props.item
			setDataItem(convertDataCommon)
		}
		if (!open) {
			setDataInput({
				...dataInput,
				quantity: props.type === 'changeOrder' ? props?.item?.quantity : 1,
			})
		}
	}, [open, props?.item?.quantity])

	const ENV_HOST = process.env.NEXT_PUBLIC_HOST
	const socket = useSocket(ENV_HOST)

	const handleOk = () => {
		setOpen(false)
		setConfirmLoading(false)
		let obj = {}
		let eventName = 'myEvent'
		if (dataInput?.quantity > 0) {
			obj = {
				type: 'create',
				tableNumber: getLocationOrderUser?.tableNumber,
				productId: dataItem._id,
				locationId: getLocationOrderUser?.location?._id,
				quantity: dataInput.quantity,
				description: dataInput.description,
				status: 'order_inprogess',
			}
		} else {
			obj = {
				id: props.item._id,
				type: 'delete',
				tableNumber: getLocationOrderUser?.tableNumber,
				locationId: getLocationOrderUser?.location?._id,
				status: 'order_deleted',
			}
		}
		if (socket) {
			// Gửi sự kiện tới Socket.IO server
			socket.emit(eventName, obj)
			socket.emit('getProductOrder', {
				message: 'Gửi sự kiện lấy sản phẩm',
				locationId: getLocationOrderUser?.location?._id,
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
		setDataInput({ ...dataInput, description: event?.target?.value })
	}

	return (
		<>
			<Button
				type={props.type === 'changeOrder' ? 'primary' : 'default'}
				className={props.styles}
				onClick={showModal}
				disabled={dataItem && dataItem.quantity <= 0}
			>
				{props.type === 'changeOrder'
					? `(${props?.item?.quantity}) ${props.label}`
					: '' + props.label}
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
						style={{
							background: props.type === 'changeOrder' && dataInput.quantity <= 0 ? 'red' : '',
						}}
						loading={confirmLoading}
						onClick={handleOk}
						disabled={
							props.type !== 'changeOrder'
								? !getLocationOrderUser?.location?._id || dataInput.quantity <= 0
								: false
						}
					>
						{props.type === 'changeOrder' && dataInput.quantity <= 0 ? 'Xóa món' : 'Đặt ngay'}
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
							key={dataItem.id}
							actions={[
								<IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
								<IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
							]}
						>
							<List.Item.Meta
								avatar={<Avatar src={`http://localhost:3000/images/${dataItem.file}`} />}
								title={dataItem.name}
								description={
									<div
										style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
									>
										<Tooltip placement="top" title={dataItem.Description}>
											{dataItem.Description}
										</Tooltip>
									</div>
								}
							/>
						</List.Item>
						<Space>
							<h5>Nhập số lượng: </h5>
							<InputNumber
								min={0}
								max={100}
								defaultValue={props.type === 'changeOrder' ? dataItem.quantity : 1}
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
								value={getLocationOrderUser?.location?.nameLocation}
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
