import React, { useEffect } from 'react'
import {
	DownOutlined,
	UserOutlined,
	LoginOutlined,
	LogoutOutlined,
	SettingOutlined,
	DownCircleOutlined,
	BellOutlined,
	EnvironmentOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, Menu, MenuProps } from 'antd'
import { Dropdown, Space, Input, Tooltip } from 'antd'
import CartItem from '../main/cartItem'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import SelectSearch from '@/components/common/inputSelectSearch'
import { toast } from 'react-toastify'
import _ from 'lodash'
import Link from 'next/link'
import { fetchUserById } from '@/redux/componentSlice/userSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
const itemsRender: MenuProps['items'] = [
	{
		label: (
			<Link className="style-menu" href="https://www.antgroup.com">
				<LoginOutlined />
				Đăng ký
			</Link>
		),
		key: '0',
	},
	{
		label: (
			<Link className="style-menu" href="/login">
				<LogoutOutlined />
				Đăng nhập
			</Link>
		),
		key: '1',
	},
]
const items: MenuProps['items'] = [
	{
		label: (
			<Link className="style-menu" href="/login">
				<LogoutOutlined />
				Đăng xuất
			</Link>
		),
		key: '0',
	},
	{
		label: (
			<Dropdown menu={{ items: itemsRender }} placement="topRight" arrow={{ pointAtCenter: true }}>
				<Link className="style-menu" href="https://www.aliyun.com">
					<SettingOutlined />
					Quản lý tài khoản
				</Link>
			</Dropdown>
		),
		key: '1',
	},
]

const onSearch = (value: string) => console.log(value)
const AvatarComponent: React.FC = () => {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()
	const user = useSelector((state: any) => state.user.account.user)
	const isOrderPage = router.pathname.startsWith('/order')
	const message = useSelector((state: any) => state.message.message.data)
	const [userRequest, setUserRequest] = React.useState('')
	const [showMessage, setShowMessage] = React.useState<Boolean>(false)
	const [showMenu, setShowMenu] = React.useState([])

	useEffect(() => {
		if (message !== null) {
			setShowMessage(true)
			setShowMenu(message)
			setTimeout(() => {
				setShowMessage(false)
			}, 2000)
		}
	}, [message])
	console.log(message, 'user1213')

	useEffect(() => {
		let userInfo
		if (typeof window !== 'undefined') {
			userInfo = JSON.parse(localStorage.getItem('user'))
		}

		const fetchData = async () => {
			try {
				if (!isOrderPage) {
					const { payload } = await dispatch(fetchUserById(userInfo.userId))
					if (payload?.success) {
						setUserRequest(payload.data.username)
						return
					}

					toast('user not found', {
						position: 'top-center',
						autoClose: 1000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						type: 'error',
					})
					return
				}
			} catch (error) {
				console.error(error)
			}
		}

		fetchData()
	}, [])

	const handleShowOptionMenu = () => {
		// Lấy thời gian hiện tại
		var thoiGianHienTai = new Date()

		// Lấy giờ, phút và giây
		var gio = thoiGianHienTai.getHours()
		var phut = thoiGianHienTai.getMinutes()
		var giay = thoiGianHienTai.getSeconds()
		var gioPhutGiay = gio + ':' + phut + ':' + giay
		return showMenu?.length > 0 ? (
			showMenu.map((ele, index) => (
				<Menu.Item
					key={index}
					style={{
						background: '#efeffd',
						marginBottom: '5px',
						display: 'flex',
						gap: '5px',
						alignItems: 'center',
					}}
				>
					<DownCircleOutlined style={{ fontSize: '16px', color: 'rgb(43 215 0)' }} />
					<a style={{ marginLeft: '5px', fontWeight: '600' }}>{ele}</a>
					<div style={{ fontSize: '12px' }}>
						<span>Thời gian: </span>
						<span>{gioPhutGiay}</span>
					</div>
				</Menu.Item>
			))
		) : (
			<Menu.Item>No data</Menu.Item>
		)
	}

	return (
		<div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
			<div
				style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', alignItems: 'center' }}
			>
				<Tooltip title="Tìm kiếm khu vực tại đây" color={'red'} key={'red'}>
					<EnvironmentOutlined style={{ fontSize: '22px', width: '30px', display: 'flex' }} />
				</Tooltip>
			</div>

			<div
				style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}
			>
				<SelectSearch />
				<Space wrap>
					<Dropdown
						dropdownRender={(menu) => (
							<Menu style={{ height: '200px' }}>
								<Menu.Item>
									<h5>Thông báo của bạn</h5>
								</Menu.Item>
								{handleShowOptionMenu()}
							</Menu>
						)}
						trigger={['click']}
					>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								<Tooltip
									placement="bottomLeft"
									title={'Bạn có thông báo mới'}
									color={'red'}
									key={'red'}
									open={showMessage}
								>
									<Badge dot={message !== null ? 'show' : ''} style={{ display: 'flex' }}>
										<BellOutlined style={{ fontSize: '22px', width: '30px' }} />
									</Badge>
								</Tooltip>
							</Space>
						</a>
					</Dropdown>
				</Space>
				<Space wrap>
					<CartItem />
				</Space>
				{isOrderPage ? (
					''
				) : (
					<Space wrap>
						<Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
							<a onClick={(e) => e.preventDefault()} style={{ color: '#050354' }}>
								<Space>
									<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
									{user?.username || userRequest}
									<DownOutlined />
								</Space>
							</a>
						</Dropdown>
					</Space>
				)}
			</div>
		</div>
	)
}

export default AvatarComponent
