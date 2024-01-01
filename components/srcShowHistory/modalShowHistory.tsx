import React, { useState } from 'react'
import { Button, Modal, Space } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import InputDateTime from '../common/commonInput/inputDateTime'
import CommonFilter from '../common/commonInput/commonFilter'
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
	let router = useRouter()
	const isOrderPage = router.pathname.startsWith('/order')
	const [open, setOpen] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const dispatch = useDispatch()
	const showModal = () => {
		setOpen(true)
	}
	const handleOk = () => {}

	const handleCancel = () => {
		setOpen(false)
	}
	// --------------- handle common filter---------------
	const items: MenuProps['items'] = [
		{
			key: '1',
			value: '1st menu item',
			label: <p>1st menu item</p>,
		},
		{
			key: '2',
			value: '2st menu item',
			label: <p>1st menu item</p>,
		},
		{
			key: '3',
			value: '3st menu item',
			label: <p>1st menu item</p>,
		},
	]
	const works: MenuProps['items'] = [
		{
			key: '1',
			value: 'ca 1',
			label: <p>ca 1</p>,
		},
		{
			key: '2',
			value: 'ca 2',
			label: <p>ca 2</p>,
		},
		{
			key: '3',
			value: 'ca 3',
			label: <p>ca 3</p>,
		},
	]

	const [state, setState] = useState({ locationWork: 'Chọn nơi làm việc', timeWork: 'Chọn ca' })
	const handleLocationChange = (field, value) => {
		setState({ ...state, [field]: value })
	}
	// --------------- end handle common filter---------------

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
				<div className="history_style">
					<ClockCircleOutlined />
					<b>Lịch sử hoạt động</b>
				</div>
				<div style={{ maxHeight: '400px', overflow: 'auto' }}>
					<div>
						<div className="history_style_box">
							<div className="style-bill">
								Số đơn xác nhận:
								<span style={{ marginLeft: '10px', color: 'green' }}>
									<b>100</b>
								</span>
							</div>
							<div className="style-bill">
								Số đơn hủy:
								<span style={{ marginLeft: '10px', color: 'red' }}>
									<b>100</b>
								</span>
							</div>
							<div className="style-bill">
								Số ca làm việc:
								<span style={{ marginLeft: '10px', color: 'blue' }}>
									<b>100</b>
								</span>
							</div>
							<div className="style-bill">
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
