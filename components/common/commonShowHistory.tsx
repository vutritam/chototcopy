import React, { useEffect, useState } from 'react'
import { Avatar, Button, InputNumber, List, Modal, Select, Space, Spin } from 'antd'
import { LikeOutlined, MessageOutlined, ClockCircleOutlined } from '@ant-design/icons'
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
import { processRouterQuery } from './parseNumber'
import L10N from '../L10N/en.json'
import CommonCollapseItem from './commonCollapse'
import InputDateTime from './inputDateTime'
import CommonFilter from './commonFilter'
import type { MenuProps } from 'antd'
// import InputDateTime from './inputDateTime'
// import CommonCollapse from './commonCollapse'
// import CommonCollapseItem from './commonCollapse'

interface inputProps {
	label: string
	tittle: string
	item: any
}
const CommonShowHistory = (props: inputProps): JSX.Element => {
	const [idTable, setIdTable] = useState<any>(0)
	let router = useRouter()
	const isOrderPage = router.pathname.startsWith('/order')
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	// const [dataInput, setDataInput] = useState({
	// 	quantity: 1,
	// 	location: '',
	// })
	const [isExpanded, setExpanded] = React.useState(false)
	let getLocationEmployee = JSON.parse(sessionStorage.getItem('user') || '')
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

	// const [socket, setSocket] = useState(null)

	// useEffect(() => {
	// 	const newSocket = io('http://localhost:3500')
	// 	setSocket(newSocket)

	// 	return () => {
	// 		newSocket.disconnect()
	// 	}
	// }, [])

	// useEffect(() => {
	// 	// setLoading(true)
	// 	const convertedValue = processRouterQuery(router?.query)
	// 	setIdTable(convertedValue)
	// }, [router?.query])

	const handleOk = () => {}

	const handleCancel = () => {
		setOpen(false)
	}
	// --------------- handle common filter---------------
	const items: MenuProps['items'] = [
		{
			key: '1',
			value: '1st menu item',
			label: (
				<p>1st menu item</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
		},
		{
			key: '2',
			value: '2st menu item',
			label: (
				<p>1st menu item</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
			// label: <p>1st menu item</p>,
		},
		{
			key: '3',
			value: '3st menu item',
			label: (
				<p>1st menu item</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
		},
	]
	const works: MenuProps['items'] = [
		{
			key: '1',
			value: 'ca 1',
			label: (
				<p>ca 1</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
		},
		{
			key: '2',
			value: 'ca 2',
			label: (
				<p>ca 2</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
			// label: <p>1st menu item</p>,
		},
		{
			key: '3',
			value: 'ca 3',
			label: (
				<p>ca 3</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
		},
	]

	const [state, setState] = useState({ locationWork: 'Chọn nơi làm việc', timeWork: 'Chọn ca' })
	const handleLocationChange = (field, value) => {
		setState({ ...state, [field]: value })
	}
	// --------------- end handle common filter---------------

	// const onChangeQuantity = (value: any) => {
	// 	// setDataInput({ ...dataInput, quantity: value })
	// }
	// const onChangeLocation = (label: any) => {
	// 	// setDataInput({ ...dataInput, location: label })
	// }

	return (
		<>
			<Button type="primary" onClick={showModal}>
				{props.label}
			</Button>
			<Modal
				title={confirmLoading ? '' : <p style={{ color: 'blue' }}>{props.tittle}</p>}
				open={open}
				width={600}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				footer={null}
			>
				<Space direction="vertical">
					<Space wrap>
						<InputDateTime />
						<CommonFilter
							fieldName="locationWork"
							items={items}
							state={state.locationWork}
							handleLocationChange={handleLocationChange}
						/>
						<CommonFilter
							fieldName="timeWork"
							items={works}
							state={state.timeWork}
							handleLocationChange={handleLocationChange}
						/>
					</Space>
				</Space>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '5px',
						color: 'green',
						marginTop: '10px',
					}}
				>
					<ClockCircleOutlined />
					<b>Lịch sử hoạt động</b>
				</div>
				<div style={{ maxHeight: '400px', overflow: 'auto' }}>
					{/* <CommonCollapseItem isActive={isExpanded} />
					<CommonCollapseItem isActive={isExpanded} /> */}
					{/* <CommonCollapseItem isActive={isExpanded} /> */}
					<div>
						<div
							style={{
								// marginTop: '10px',
								fontSize: '13px',
								borderLeft: '2px solid #bdbde3',
								padding: '8px',
							}}
						>
							<div style={{ padding: 0, margin: 0, lineHeight: '20px' }}>
								Số đơn xác nhận:
								<span style={{ marginLeft: '10px', color: 'green' }}>
									<b>100</b>
								</span>
							</div>
							<div style={{ padding: 0, margin: 0, lineHeight: '20px' }}>
								Số đơn hủy:
								<span style={{ marginLeft: '10px', color: 'red' }}>
									<b>100</b>
								</span>
							</div>
							<div style={{ padding: 0, margin: 0, lineHeight: '20px' }}>
								Số ca làm việc:
								<span style={{ marginLeft: '10px', color: 'blue' }}>
									<b>100</b>
								</span>
							</div>
							<div style={{ padding: 0, margin: 0, lineHeight: '20px' }}>
								Nơi làm việc:
								<span style={{ marginLeft: '10px' }}>
									<b>Tân chánh hiệp quận 12</b>
								</span>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default CommonShowHistory
