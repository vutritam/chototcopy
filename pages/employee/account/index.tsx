import { Button, Form, Image, Input, Row, Select } from 'antd'
import { useEffect, useState } from 'react'
import { CameraOutlined, EditOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Label } from 'semantic-ui-react'
import FileUpload from '@/components/common/upload'

function Manage_account() {
	const [editMode, setEditMode] = useState('')
	const [UploadImg, setUpload] = useState({ image: '' })
	const handleEditProfile = (value: string) => {
		setEditMode(value)
	}
	const onFinish = async (values: any) => {
		const formData = new FormData()
		switch (editMode) {
			case 'edit_pass':
				formData.append('name', values.password)
				formData.append('price', values.newPassword)

			case 'edit_information':
				formData.append('username', values.username)
				formData.append('email', values.email)
				formData.append('location', values.location)
				formData.append('information', UploadImg.image?.file?.originFileObj)
				formData.append('active', values.active)
				formData.append('address', values.address)

			default:
				break
		}
		console.log(formData)
	}
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
					rules={[{ required: true, message: 'Please input your Username!' }]}
				>
					<Label content="Mật khẩu cũ" />
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Mật khẩu cũ"
					/>
				</Form.Item>
				<Form.Item
					name="newPassword"
					rules={[{ required: true, message: 'Please input your Username!' }]}
				>
					<Label content="Mật khẩu mới" />
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Mật khẩu mới"
					/>
				</Form.Item>
				<Form.Item
					name="newPassword"
					rules={[{ required: true, message: 'Please input your Username!' }]}
				>
					<Label content="Mật khẩu mới" />
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Mật khẩu mới"
					/>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						// loading={loadings}
						className="login-form-button"
					>
						Cập nhật
					</Button>
					<Button type="ghost" onClick={() => handleEditProfile('')} className="login-form-button">
						Hủy bỏ
					</Button>
				</Form.Item>
			</Form>
		)
	}
	const renderEditInformation = () => {
		return (
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
					<Label content="Tên đăng nhập" />
					<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
				</Form.Item>

				<Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
					<Label content="Email cá nhân" />
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="email"
						placeholder="email"
					/>
				</Form.Item>
				<Form.Item
					name="location"
					rules={[{ required: true, message: 'Please input your Location!' }]}
				>
					<Label content="Địa điểm làm việc" />
					<Input
						disabled={true}
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="text"
						placeholder="Địa điểm"
					/>
				</Form.Item>
				<Form.Item
					name="information"
					rules={[{ required: true, message: 'Please input your Location!' }]}
				>
					<Label content="Thông tin cá nhân" />

					<FileUpload setUpload={setUpload} />
				</Form.Item>
				<Form.Item
					name="active"
					rules={[{ required: true, message: 'Please input your Location!' }]}
				>
					<Label content="Trạng thái hoạt động" />
					<Input
						disabled={true}
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="text"
						placeholder="Đang hoạt động"
					/>
				</Form.Item>
				<Form.Item
					name="address"
					rules={[{ required: true, message: 'Please input your Location!' }]}
				>
					<Label content="Địa chỉ" />
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="text"
						placeholder="địa chỉ"
					/>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						// loading={loadings}
						className="login-form-button"
					>
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
	return (
		<div>
			<h2 style={{ marginBottom: '30px' }}>
				<UserOutlined />
				Thông tin cá nhân
			</h2>
			{editMode !== '' ? (
				renderComponent(editMode)
			) : (
				<div style={{ display: 'flex', gap: '10px' }}>
					<Image
						width={200}
						src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
					/>
					<div>
						<h2 style={{ color: 'blue' }}>Vũ Trí Tâm</h2>

						<div>
							<span>
								<b>Vai trò</b>: Nhân viên
							</span>
							<span>
								<div style={{ display: 'flex', gap: '10px' }}>
									<b>Trạng thái: </b>
									<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
										<div className="online-active-employee " style={{ width: '10px' }}></div>
										<span>Đang hoạt động</span>
									</div>
								</div>
							</span>
							<span>
								<div style={{ display: 'flex', gap: '10px' }}>
									<b>Ngày bắt đầu: </b>
									<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
										16/12/1999
									</div>
								</div>
							</span>
							<span>
								<div style={{ display: 'flex', gap: '10px' }}>
									<b>Nơi làm việc: </b>
									<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
										Hóc môn quận 12
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
