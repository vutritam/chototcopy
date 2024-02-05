import { Button, Form, Image, Input, Modal, Row, Select, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { CameraOutlined, EditOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Label, TextArea } from 'semantic-ui-react'
import FileUpload from '@/components/common/upload'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import {
	fetchAllUser,
	fetchUserById,
	getAllUserRequest,
	setAcceptRequestUsers,
	setUser,
	updateIsChangeRequestUser,
	updatePasswordUser,
	updateProfileUser,
} from '@/redux/componentSlice/userSlice'
import Toasty from '@/components/common/toasty'
import { useRouter } from 'next/router'
import ModalConfirm from '@/components/common/commonModal/modalReasonChangeLocation'
import { io } from 'socket.io-client'
import axiosConfig from '../../api/axiosConfigs'

function Manage_account() {
	const user = useSelector((state: any) => state.user.account.user)
	const userListAcceptRequestUsers = useSelector((state: any) => state.user.isAcceptRequestUsers)
	const [editMode, setEditMode] = useState('')
	const [selectedLocation, setLocation] = useState('')
	const [disabledLocation, setDisabledLocation] = useState(false)
	const router = useRouter()
	const [loadings, setLoadings] = useState<boolean>(false)
	const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false)
	const [open, setOpen] = useState<boolean>(false)
	const [openAcceptRequest, setOpenAcceptRequest] = useState<boolean>(false)
	const [reason, setReason] = useState<string>('')
	const [listLocation, setListLocation] = useState([])
	const [UploadImg, setUpload] = useState({ image: '' })
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const passwordInputRef = useRef(null)
	const reNewPasswordInputRef = useRef(null)
	const [socket, setSocket] = useState<any>(null)
	const ENV_HOST = process.env.NEXT_PUBLIC_HOST
	let getInforUser = JSON.parse(sessionStorage.getItem('user'))
	useEffect(() => {
		const fetchDataUser = async () => {
			try {
				const { payload } = await dispatch(getAllUserRequest())
				if (payload?.success) {
					await dispatch(setAcceptRequestUsers(payload.data))
				}
			} catch (error) {}
		}
		const fetchLocation = async () => {
			let response = await axiosConfig.get(`/location/getAllLocation`)

			if (response?.data?.success) {
				setListLocation(response.data.data)
			} else {
				Toasty.error(response.data.message)
			}
		}
		fetchLocation()
		fetchDataUser()
	}, [])

	useEffect(() => {
		const statusItem = userListAcceptRequestUsers.data.filter(
			(item) => item.userId._id === user?.data?._id
		)[0]?.status
		const nameLocation = userListAcceptRequestUsers.data.filter(
			(item) => item.userId._id === user?.data?._id
		)[0]?.locationId?.nameLocation
		if (
			user?.data?.userRequestId?.isRequest === 'change_location' &&
			statusItem === 'request_pending'
		) {
			setLocation(nameLocation)
			setDisabledLocation(true)
		} else if (user?.data?.userRequestId?.isRequest === 'unChange_location' && statusItem === '') {
			setLocation(user?.data?.locationId?.nameLocation)
			setDisabledLocation(false)
		} else if (
			getInforUser?.data?.locationId !== user?.data?.userRequestId?.locationId &&
			statusItem === 'request_accepted'
		) {
			setOpenAcceptRequest(true)
		} else {
			setLocation(user?.data?.locationId?.nameLocation)
			setDisabledLocation(false)
		}
	}, [editMode, userListAcceptRequestUsers.data])

	const handleShow = async (show) => {
		if (!show && !reason) {
			setLoadingConfirm(false)
		} else if (selectedLocation !== '' && reason !== '') {
			setLoadingConfirm(true)
			const { payload } = await dispatch(
				updateIsChangeRequestUser({
					isRequest: 'change_location',
					reason: reason,
					_id: user?.data?._id,
					locationId: selectedLocation,
					status: 'request_pending',
				})
			)
			if (payload?.success) {
				setDisabledLocation(true)
				setLoadingConfirm(false)
				setLocation(selectedLocation)
			}
			Toasty.success(payload.message)
		}
		setReason('')
		setOpen(show)
	}

	const handleEditProfile = (value: string) => {
		setEditMode(value)
	}
	const initialValues = {
		username: user?.data?.username,
		email: user?.data?.email,
		location: user?.data?.location,
		file: user?.data?.file,
		address: user?.data?.address,
	}
	const handleMessageStatus = (data) => {
		const { message, fieldError } = data
		switch (fieldError) {
			case 'password':
				reNewPasswordInputRef.current !== null && passwordInputRef.current.select()
				Toasty.error(message)
				break
			case 'reNewPassword':
				reNewPasswordInputRef.current !== null && reNewPasswordInputRef.current.select()
				Toasty.error(message)
				break
			default:
				Toasty.error(message)
				break
		}
	}
	const onFinish = async (values: any) => {
		const formData = new FormData()
		const info = sessionStorage !== null && JSON.parse(sessionStorage.getItem('user'))
		const dataImage = UploadImg?.image?.file
		// console.log(values, 'dataform')

		switch (editMode) {
			case 'edit_pass':
				formData.append('_id', info && info.data && info.data.userId)
				formData.append('password', values.password)
				formData.append('newPassword', values.newPassword)
				// formData.append('location', selectedLocation)
				formData.append('reNewPassword', values.reNewPassword)
				const payloadPassword = await dispatch(updatePasswordUser(formData))
				if (payloadPassword?.payload?.success) {
					Toasty.success(payloadPassword.payload?.message)
					router.push('/login')
				} else {
					handleMessageStatus(payloadPassword.payload)
				}
				break
			case 'edit_information':
				formData.append('_id', info && info.data && info.data.userId)
				formData.append('username', values.username)
				formData.append('email', values.email)
				formData.append('file', dataImage?.originFileObj)
				formData.append('address', values.address)
				const { payload } = await dispatch(updateProfileUser(formData))
				if (payload?.success) {
					await dispatch(fetchUserById(info.data.userId))
					Toasty.success(payload?.message)
					setEditMode('')
				} else {
					handleMessageStatus(payload)
				}
				break
			default:
				break
		}
	}
	const handleChangeReason = (value: string) => {
		setReason(value)
	}

	const handleChangeLocation = (data) => {
		console.log(data, 'data nè')

		if (data !== user?.data?.locationId?._id) {
			handleShow(true)
		}

		setLocation(data)
	}
	useEffect(() => {
		const initSocket = () => {
			const newSocket = io(ENV_HOST)
			newSocket.on('connect', () => {
				console.log('Socket connected')
			})
			newSocket.on('disconnect', () => {
				console.log('Socket disconnected')
			})
			setSocket(newSocket)
		}
		initSocket()
	}, [ENV_HOST])

	const renderEditPass = () => {
		return (
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{ remember: true }}
				onFinish={onFinish}
			>
				<Form.Item
					name="password"
					required
					rules={[{ required: true, message: 'Please input your mật khẩu!' }]}
					label={<Label content="Mật khẩu cũ" />}
				>
					<Input
						ref={passwordInputRef}
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Mật khẩu cũ"
					/>
				</Form.Item>
				<Form.Item
					required
					name="newPassword"
					rules={[{ required: true, message: 'Please input your mật khẩu!' }]}
					label={<Label content="Mật khẩu mới" />}
				>
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Mật khẩu mới"
					/>
				</Form.Item>
				<Form.Item
					name="reNewPassword"
					rules={[{ required: true, message: 'Please input your mật khẩu!' }]}
					label={<Label content="Mật khẩu mới" />}
				>
					<Input
						ref={reNewPasswordInputRef}
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Mật khẩu mới"
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loadings} className="login-form-button">
						Cập nhật
					</Button>
					<Button type="ghost" onClick={() => handleEditProfile('')} className="login-form-button">
						Hủy bỏ
					</Button>
				</Form.Item>
			</Form>
		)
	}
	const handleUnRequest = async () => {
		setLocation(user?.data.locationId?.nameLocation)
		let IsChangeRequest = 'unChange_location'
		const { payload } = await dispatch(
			updateIsChangeRequestUser({
				isRequest: IsChangeRequest,
				reason: reason,
				_id: user?.data?._id,
				locationId: '',
				status: '',
			})
		)
		if (payload?.success) {
			console.log(payload, 'unchange request')
		}
		setDisabledLocation(false)
		Toasty.success(payload.message)
	}

	const renderEditInformation = () => {
		return (
			<Form
				name="normal_login"
				className="login-form"
				initialValues={initialValues}
				onFinish={onFinish}
			>
				<Form.Item
					name="username"
					required
					rules={[{ required: true, message: 'Please input your Username!' }]}
					label={<Label content="Tên đăng nhập" />}
				>
					<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
				</Form.Item>

				<Form.Item
					name="email"
					rules={[{ required: true, message: 'Please input your email!' }]}
					label={<Label content="Email cá nhân" />}
				>
					<Input
						required
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="email"
						placeholder="email"
					/>
				</Form.Item>
				<Form.Item name="location" label={<Label content="Địa điểm làm việc" />}>
					{disabledLocation ? (
						<>
							<Input
								disabled={user?.data?.userRequestId?.isRequest !== '' ? true : false}
								value={selectedLocation}
							/>
							<div className="flex-basic">
								<p style={{ color: '#e98c13' }}>Đang chờ xác nhận....</p>
								<Button className="button-warning" onClick={handleUnRequest}>
									Hủy yêu cầu
								</Button>
							</div>
						</>
					) : (
						<Select
							suffixIcon={<LockOutlined className="site-form-item-icon" />}
							placeholder="Nhập địa điểm làm việc"
							onChange={handleChangeLocation}
							value={
								selectedLocation !== '' ? selectedLocation : user?.data?.locationId?.nameLocation
							}
						>
							{listLocation?.map((item, index) => (
								<>
									<Select.Option value={item?._id}>{item?.nameLocation}</Select.Option>
								</>
							))}
						</Select>
					)}

					<ModalConfirm
						loading={loadingConfirm}
						open={open}
						handleShow={handleShow}
						title="Lý do đổi địa điểm"
						reason={reason}
						handleChangeReason={handleChangeReason}
					/>
				</Form.Item>
				<Form.Item name="file" label={<Label content="Thông tin cá nhân" />}>
					<FileUpload setUpload={setUpload} dataImage={user?.data.file} />
				</Form.Item>
				<Form.Item name="address" label={<Label content="Địa chỉ" />}>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="text"
						placeholder="địa chỉ"
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loadings} className="login-form-button">
						Cập nhật
					</Button>
					<Button type="ghost" onClick={() => handleEditProfile('')} className="login-form-button">
						Hủy bỏ
					</Button>
				</Form.Item>
			</Form>
		)
	}

	const renderComponent = (editMode: string) => {
		switch (editMode) {
			case 'edit_pass':
				return renderEditPass()
			case 'edit_information':
				return renderEditInformation()
			default:
				break
		}
	}
	const handleOk = () => {
		setOpenAcceptRequest(false)
		router.push('/login')
	}

	return (
		<div>
			<h2 style={{ marginBottom: '30px' }}>
				<UserOutlined />
				Thông tin cá nhân
			</h2>
			<Modal
				title="Thông báo"
				open={openAcceptRequest}
				footer={
					<Button type="primary" onClick={handleOk}>
						Xác nhận
					</Button>
				}
			>
				<p>Yêu cầu đổi địa điểm của bạn đã được chấp nhận (vui lòng đăng nhập lại)</p>
			</Modal>
			{editMode !== '' ? (
				renderComponent(editMode)
			) : (
				<div style={{ display: 'flex', gap: '10px' }}>
					<Image
						width={200}
						src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBQps5fClhHJiKDtaRZl2ly6FBIYnIkiORBt-4HqfoYFrU2hFzBqx8hmszfsQ7SzrpPM0&usqp=CAU`}
					/>
					<div>
						<h2 style={{ color: 'blue' }}>{user?.data?.username}</h2>
						<div>
							<span>
								<b>Vai trò</b>: Nhân viên
							</span>
							<span>
								<div style={{ display: 'flex', gap: '10px' }}>
									<b>Trạng thái: </b>
									<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
										<div className="online-active-employee " style={{ width: '10px' }}></div>
										<span>{user?.data?.active ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
									</div>
								</div>
							</span>
							<span>
								<div style={{ display: 'flex', gap: '10px' }}>
									<b>Ngày bắt đầu: </b>
									<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
										{user?.data?.createdAt}
									</div>
								</div>
							</span>
							<span>
								<div style={{ display: 'flex', gap: '10px' }}>
									<b>Nơi làm việc: </b>
									<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
										{user?.data?.locationId?.nameLocation}
									</div>
								</div>
							</span>
							<div style={{ marginTop: '10px' }}>
								<span>
									{' '}
									<Button icon={<CameraOutlined />}>Thay ảnh</Button>
								</span>
								<span>
									{' '}
									<Button icon={<EditOutlined />} onClick={() => handleEditProfile('edit_pass')}>
										Đổi mật khẩu
									</Button>
								</span>
								<span>
									{' '}
									<Button
										icon={<EditOutlined />}
										onClick={() => handleEditProfile('edit_information')}
									>
										Cập nhật thông tin
									</Button>
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Manage_account
