import React, { useState, useEffect } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Select, Space, Spin, Tabs } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRegisterUser, fetchCreatePost } from '../../redux/componentSlice/userSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Toasty from '@/components/common/toasty'
import UseAuthentication from '../common/useAuth'

const LoginForm: React.FC = () => {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const [loadings, setLoadings] = useState<boolean>(false)
	const [keyTab, setKeyTab] = useState<number>(1)
	const user = useSelector((state: any) => state.user.account.user)
	let router = useRouter()
	const onFinish = async (options: any) => {
		setLoadings(true)
		if (keyTab === 1) {
			const { payload } = await dispatch(fetchCreatePost(options))
			if (payload?.success) {
				setTimeout(() => {
					setLoadings(false)
					Toasty.success(payload?.message)
					if (user && user?.roles?.includes('admin')) {
						router.push('/admin')
					} else {
						router.push('/employee')
					}
					// dispatch(setUser(payload))
				}, 1000)
				localStorage.setItem('user', JSON.stringify(payload))
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
		const { payload } = await dispatch(fetchRegisterUser(options))
		if (payload?.success) {
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

	const onChange = (key: number) => {
		setKeyTab(key)
	}
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		// setLoading(true)
		setTimeout(() => {
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
