import React, { useState, useEffect, useRef } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Select, Space, Spin, Tabs } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRegisterUser, fetchCreatePost, setUser } from '../../redux/componentSlice/userSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Toasty from '@/components/common/toasty'
import UseAuthentication from '../common/useAuth'
import { io } from 'socket.io-client'
const LoginForm: React.FC = () => {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const [loadings, setLoadings] = useState<boolean>(false)
	const [keyTab, setKeyTab] = useState<number>(1)
	const [socket, setSocket] = useState(null)
	const passwordInputRef = useRef(null)
	const usernameInputRef = useRef(null)
	// const user = JSON.parse(sessionStorage.getItem('user'))
	let router = useRouter()
	useEffect(() => {
		const ENV_HOST = process.env.NEXT_PUBLIC_HOST
		const newSocket = io(ENV_HOST)
		setSocket(newSocket)

		return () => {
			newSocket.disconnect()
		}
	}, [])
	const onFinish = async (options: any) => {
		setLoadings(true)
		if (keyTab === 1) {
			const { payload } = await dispatch(fetchCreatePost(options))
			console.log(payload, 'login nè')

			if (payload?.success) {
				sessionStorage.setItem('user', JSON.stringify(payload))

				setTimeout(() => {
					setLoadings(false)
					Toasty.success(payload?.message)

					if (payload.data?.roles?.includes('admin')) {
						localStorage.setItem('role_access', '/admin')
						router.push('/admin')
					} else {
						if (socket && sessionStorage.getItem('user') !== null) {
							let getUserId = JSON.parse(sessionStorage.getItem('user'))
							// Gửi sự kiện tới Socket.IO server
							socket.emit('afterUserLogin', {
								message: 'Hello from client',
								location: getUserId?.data?.location,
								time: new Date(),
								tableNumber: null,
								productId: null,
								userId: getUserId?.data?.userId,
								isPage: 'admin_page',
							})
							localStorage.setItem('role_access', '/employee')
							router.push('/employee')
						}
					}
					// dispatch(setUser(payload))
				}, 1000)
				// console.log(payload, 'pay')

				dispatch(setUser(payload))

				return
			}

			setTimeout(() => {
				setLoadings(false)
				toast(payload?.message, {
					position: 'top-center',
					autoClose: 1500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					isLoading: false,
					draggable: true,
					progress: undefined,
					type: 'error',
				})
				if (passwordInputRef !== null && payload.fieldError === 'username') {
					usernameInputRef.current.focus()
					usernameInputRef.current.select()
				} else {
					passwordInputRef.current.focus()
					passwordInputRef.current.select()
				}
			}, 1800)
		} else {
			const { payload } = await dispatch(fetchRegisterUser(options))
			if (payload?.success) {
				usernameInputRef.current.value = ''
				passwordInputRef.current.value = ''
				setTimeout(() => {
					setLoadings(false)
					// dispatch(setUser(payload))
					Toasty.success(payload?.message)
					setKeyTab(1)
				}, 1000)
				return
			}
			setTimeout(() => {
				setLoadings(false)
				toast(payload?.message, {
					position: 'top-center',
					autoClose: 1500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					isLoading: false,
					draggable: true,
					progress: undefined,
					type: 'error',
				})
			}, 1800)
		}
	}

	const onChange = (key: number) => {
		setKeyTab(key)
	}
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		// localStorage.removeItem('user')
		// setLoading(true)
		setTimeout(() => {
			// localStorage.removeItem('user')
			setLoading(false)
		}, 1000)
	}, [])
	const items = [
		{
			label: `Đăng nhập`,
			key: 1,
			children: (
				<div>
					<h3 style={{ marginBottom: '40px' }}>ĐĂNG NHẬP HỆ THỐNG</h3>
					<Form
						name="normal_login"
						className="login-form"
						initialValues={{ remember: true }}
						onFinish={onFinish}
					>
						<Form.Item
							name="username"
							rules={[{ required: true, message: 'Please input your Username!' }]}
						>
							<Input
								ref={usernameInputRef}
								prefix={<UserOutlined className="site-form-item-icon" />}
								placeholder="Username"
							/>
						</Form.Item>
						<Form.Item
							name="password"
							rules={[{ required: true, message: 'Please input your Password!' }]}
						>
							<Input
								ref={passwordInputRef}
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="Password"
							/>
						</Form.Item>
						<Form.Item>
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>Remember me</Checkbox>
							</Form.Item>

							<a className="login-form-forgot" href="">
								Forgot password
							</a>
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								loading={loadings}
								className="login-form-button"
							>
								Đăng nhập
							</Button>
							Or <a href="">register now!</a>
						</Form.Item>
					</Form>
				</div>
			),
		},
		{
			label: `Đăng ký`,
			key: 2,
			children: (
				<div>
					<h3 style={{ marginBottom: '40px' }}>ĐĂNG KÝ HỆ THỐNG</h3>
					<Form
						name="normal_login"
						className="login-form"
						initialValues={{ remember: true }}
						onFinish={onFinish}
					>
						<Form.Item
							name="username"
							rules={[{ required: true, message: 'Please input your Username!' }]}
						>
							<Input
								prefix={<UserOutlined className="site-form-item-icon" />}
								placeholder="Username"
							/>
						</Form.Item>
						<Form.Item
							name="password"
							rules={[{ required: true, message: 'Please input your Password!' }]}
						>
							<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="Password"
							/>
						</Form.Item>
						<Form.Item
							name="location"
							rules={[{ required: true, message: 'Please input your Location!' }]}
						>
							<Select
								suffixIcon={<LockOutlined className="site-form-item-icon" />}
								placeholder="Nhập địa điểm làm việc"
							>
								<Select.Option value="409/99 Tân chánh hiệp 12 quận 12 TP.HCM">
									409/99 Tân chánh hiệp 12 quận 12 TP.HCM
								</Select.Option>
								<Select.Option value="Trường chinh, tân bình">Trường chinh, tân bình</Select.Option>
								<Select.Option value="Hóc môn quận 12">Hóc môn quận 12</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								loading={loadings}
								className="login-form-button"
							>
								Đăng ký
							</Button>
							{/* Or <a href="">register now!</a> */}
						</Form.Item>
					</Form>
				</div>
			),
		},
	]
	return (
		<div className="custom-login backgound-img">
			{loading ? (
				<Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
					{/* <Space> */}
					<Spin tip="Loading" size="small" style={{ color: 'white' }}>
						<div className="content" />
					</Spin>
					{/* </Space> */}
				</Space>
			) : (
				<div className="form-template" style={{ background: 'white' }}>
					<Tabs
						activeKey={Number(keyTab)}
						onChange={onChange}
						type="card"
						items={items.map((ele, i) => {
							// const id = String(i + 1)
							return {
								label: ele.label,
								key: ele.key,
								children: ele.children,
							}
						})}
					/>
				</div>
			)}
		</div>
	)
}

export default LoginForm
