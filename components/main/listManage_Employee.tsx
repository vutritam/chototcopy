import React, { useEffect, useState } from 'react'
import { Avatar, Button, List, MenuProps, Skeleton, Space } from 'antd'
import CommonShowHistory from '../srcShowHistory/modalShowHistory'
import CommonFilter from '../common/commonInput/commonFilter'
import InputDateTime from '../common/commonInput/inputDateTime'
import { FileSearchOutlined } from '@ant-design/icons'
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import {
	approvedChangeRequestUser,
	getAllUserRequest,
	setAcceptRequestUsers,
} from '@/redux/componentSlice/userSlice'
import Toasty from '../common/toasty'

interface DataType {
	gender?: string
	name: {
		title?: string
		first?: string
		last?: string
	}
	email?: string
	picture: {
		large?: string
		medium?: string
		thumbnail?: string
	}
	nat?: string
	loading: boolean
}

const count = 3
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`

const List_manage_employee: React.FC = (props) => {
	const { item, IsPage } = props
	const userListAcceptRequestUsers = useSelector((state: any) => state.user.isAcceptRequestUsers)
	const [initLoading, setInitLoading] = useState(true)
	const [loading, setLoading] = useState(false)
	const [showHistory, setShowHistory] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	const [list, setList] = useState<DataType[]>([])
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

	useEffect(() => {
		fetch(fakeDataUrl)
			.then((res) => res.json())
			.then((res) => {
				setInitLoading(false)
				setData(res.results)
				setList(res.results)
			})
	}, [])
	useEffect(() => {
		if (item.length > 0) {
			setLoading(false)
		} else {
			setLoading(true)
		}
	}, [item])

	const handleShowModalHistory = () => {
		setShowHistory(!showHistory)
	}
	const [modal2Open, setModal2Open] = useState(false)
	const [titleModal, setTitleModal] = useState('')
	const handleModal = (event: any, value: boolean, title: string) => {
		setTimeout(() => {
			setModal2Open(value)
		}, 100)
		setTitleModal(title)
	}
	const handleDropdown = (e: any, value: boolean) => {
		setModal2Open(value)
	}

	// nơi làm việc
	const items: MenuProps['items'] = [
		{
			key: '1',
			value: 'Hóc môn quận 12',
			label: <p>Hóc môn quận 12</p>,
		},
		{
			key: '2',
			value: 'Tân chánh hiệp ',
			label: <p>Tân chánh hiệp </p>,
		},
		{
			key: '3',
			value: 'Tân bình',
			label: <p>Tân bình</p>,
		},
	]
	// ca làm việc
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

	const itemsAdd: MenuProps['items'] = [
		{
			key: '1',
			value: 'Đăng ký nhân viên mới',
			label: (
				<p onClick={(e) => handleModal(e, true, 'Đăng ký nhân viên mới')}>Đăng ký nhân viên mới</p>
			),
		},
		{
			key: '2',
			value: 'Thêm mới nhân viên',
			label: <p onClick={(e) => handleModal(e, true, 'Thêm mới nhân viên')}>Thêm mới nhân viên</p>,
		},
	]

	const [state, setState] = useState({
		locationWork: 'Chọn nơi làm việc',
		timeWork: 'Chọn ca',
		dateTime: '',
	})
	const handleLocationChange = (field, value) => {
		setState({ ...state, [field]: value })
	}

	const onChangeDateTime = (
		value: DatePickerProps['value'] | RangePickerProps['value'],
		dateString: [string, string] | string
	) => {
		setState({ ...state, dateTime: dateString })
	}
	const handleSubmit = () => {
		setInitLoading(true)
		// call api from server for research item on list employee
		setTimeout(() => {
			setInitLoading(false)
		}, 1000)
	}

	const handleUpdateStatus = async (idUser) => {
		const { payload } = await dispatch(
			approvedChangeRequestUser({
				_id: idUser,
				status: 'request_accepted',
			})
		)

		if (payload?.success) {
			const data = await dispatch(getAllUserRequest())

			if (data?.payload?.success) {
				await dispatch(setAcceptRequestUsers(data.payload.data))
			}
			Toasty.success(data.payload.message)
		} else {
			Toasty.error(payload.message)
		}
	}

	const renderButtonAccept = (userData) => {
		const statusItem = userListAcceptRequestUsers.data.filter(
			(item) => item.userId._id === userData._id
		)[0]?.status

		return statusItem === 'request_pending'
			? [
					<Button
						key="list-loadmore-edit"
						type="primary"
						onClick={() => handleUpdateStatus(userData._id)}
					>
						Chấp nhận
					</Button>,
					<Button key="list-loadmore-more" type="default">
						Từ chối
					</Button>,
			  ]
			: statusItem === 'request_accepted'
			? ['Đã chấp nhận']
			: ['Không chấp nhận']
	}
	return (
		<>
			{IsPage !== 'request' && (
				<div
					style={{
						position: 'sticky',
						top: '10%',
						zIndex: 11,
						background: 'rgb(255 255 255)',
						padding: '8px',
						boxShadow:
							'rgba(17, 18, 18, 0.18) 0px 1px 8px 0px, rgba(103, 151, 255, 0.11) 0px 2px 18px 0px',
					}}
				>
					<Space direction="vertical">
						<Space wrap>
							<InputDateTime onChangeTime={onChangeDateTime} />
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
							<Button type="primary" icon={<FileSearchOutlined />} onClick={handleSubmit}>
								Tìm kiếm
							</Button>
						</Space>
					</Space>
				</div>
			)}
			<h3>Danh sách yêu cầu</h3>

			<List
				className="demo-loadmore-list"
				loading={initLoading}
				itemLayout="horizontal"
				pagination={{
					onChange: (page) => {
						console.log(page)
					},
					pageSize: 3,
				}}
				// loadMore={loadMore}
				dataSource={item}
				renderItem={(item) => {
					return IsPage !== 'request' ? (
						<List.Item
							actions={[
								<a key="list-loadmore-edit">Chỉnh sửa</a>,
								<a key="list-loadmore-more">Khác</a>,
							]}
						>
							<Skeleton avatar title={false} loading={loading} active>
								<List.Item.Meta
									avatar={
										<>
											<Avatar
												src={
													'https://top10dienbien.com/wp-content/uploads/2022/10/avatar-cute-9.jpg'
												}
											/>
											<span className="online-avatar"></span>
										</>
									}
									title={<a href="https://ant.design">{item?.username}</a>}
									description={
										<>
											<p>19/09/2023</p>

											<span>
												<b>Vai trò</b>: {item?.roles?.includes('employee') ? 'Nhân viên' : 'Admin'}
											</span>
											<span>
												<div style={{ display: 'flex', gap: '10px' }}>
													<b>Trạng thái hoạt động: </b>
													<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
														<div
															className="online-active-employee "
															style={{ width: '10px' }}
														></div>
														<span>{item?.active ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
													</div>
												</div>
											</span>
										</>
									}
								/>

								<div>
									<CommonShowHistory
										label="Lịch sử hoạt động"
										tittle="Thông tin nhân viên"
										open={showHistory}
										handleShow={handleShowModalHistory}
									/>
								</div>
							</Skeleton>
						</List.Item>
					) : (
						<div>
							<List.Item actions={renderButtonAccept(item?.userId)}>
								<Skeleton avatar title={false} loading={loading} active>
									<List.Item.Meta
										avatar={
											<>
												<Avatar
													src={
														'https://top10dienbien.com/wp-content/uploads/2022/10/avatar-cute-9.jpg'
													}
												/>
												<span className="online-avatar"></span>
											</>
										}
										title={<a href="https://ant.design">{item?.userId && item?.userId.username}</a>}
										description={
											<>
												<span>
													<b>Vai trò</b>:{' '}
													{item?.userId && item.userId.roles?.includes('employee')
														? 'Nhân viên'
														: 'Admin'}
												</span>
												<div>
													<b>Lý do</b>: {item?.reason}
												</div>
												<div>
													<b>Địa điểm muốn đổi</b>: {item?.locationId?.nameLocation}
												</div>
											</>
										}
									/>
								</Skeleton>
							</List.Item>
						</div>
					)
				}}
			/>
		</>
	)
}

export default List_manage_employee
