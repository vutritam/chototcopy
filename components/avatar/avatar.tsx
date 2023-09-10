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
import {
	fetchMessageByUserRole,
	fetchMessageFromServer,
	setMessageEmployee,
} from '@/redux/componentSlice/messageSocketSlice'
import { decodeNumber, encodeNumber } from '../common/hashCode'
import { processRouterQuery } from '../common/parseNumber'
import moment from 'moment'
import { io } from 'socket.io-client'
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

interface propsData {
	userInfo: object
	dataNoti: Array<any>
}

const onSearch = (value: string) => console.log(value)
const AvatarComponent: React.FC = () => {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()
	const [idTable, setIdTable] = React.useState<any>(0)
	const user = useSelector((state: any) => state.user.account.user)
	const isOrderPage = router.pathname.startsWith('/order')
	const message = useSelector((state: any) => state.message.message.data)
	const messageEmployee = useSelector((state: any) => state.message.messageEmployee.data)
	const [userRequest, setUserRequest] = React.useState('')
	const [showMessage, setShowMessage] = React.useState<Boolean>(false)
	const [showMessageEmployee, setShowMessageEmployee] = React.useState<Boolean>(false)
	const [dataLocal, setDataLocal] = React.useState<Object>([
		{
			userInfo: {},
			dataNoti: [],
		},
	])
	const [socket, setSocket] = React.useState<any>(null)
	let getInforUser = JSON.parse(localStorage.getItem('user'))
	const handleLogOut = () => {
		localStorage.removeItem('user')
		router.push('/login')
	}
	const items: MenuProps['items'] = [
		{
			label: (
				<a className="style-menu" onClick={() => handleLogOut()}>
					<LogoutOutlined />
					Đăng xuất
				</a>
			),
			key: '0',
		},
		{
			label: (
				<Dropdown
					menu={{ items: itemsRender }}
					placement="topRight"
					arrow={{ pointAtCenter: true }}
				>
					<Link className="style-menu" href="https://www.aliyun.com">
						<SettingOutlined />
						Quản lý tài khoản
					</Link>
				</Dropdown>
			),
			key: '1',
		},
	]

	const [showMenu, setShowMenu] = React.useState([])
	const [showMenuEmployee, setShowMenuEmployee] = React.useState([])

	const onSetDataLocal = (data: propsData, callback: Function) => {
		const { userInfo, dataNoti } = data
		setDataLocal({ userInfo: userInfo, dataNoti: dataNoti })

		// Gọi callback (nếu có)
		if (typeof callback === 'function') {
			callback(data)
		}
	}
	useEffect(() => {
		;(async () => {
			const newSocket = io('http://localhost:3500')
			setSocket(newSocket)

			let obj = {
				userInfo: {},
				dataNoti: [],
			}

			let getDataUserInfo = JSON.parse(localStorage.getItem('user'))
			if (typeof window !== 'undefined') {
				obj.userInfo = getDataUserInfo?.data
				obj.dataNoti = message

				onSetDataLocal(obj, async ({ userInfo, dataNoti }: propsData) => {
					if (userInfo) {
						try {
							if (!isOrderPage) {
								const { payload } = await dispatch(fetchUserById(userInfo.userId))
								if (payload?.success) {
									setUserRequest(payload.username)
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
				})
			}

			return () => {
				newSocket.disconnect()
			}
		})()
	}, [])

	useEffect(() => {
		const convertedValue = processRouterQuery(router?.query)
		;(async () => {
			if (localStorage.getItem('location_user') !== null) {
				let getLocationOrderUser = JSON.parse(localStorage.getItem('location_user'))
				let getInforUser = JSON.parse(localStorage.getItem('user'))
				// if(getLocationOrderUser?.user)
				if (isOrderPage) {
					const { payload } = await dispatch(
						fetchMessageFromServer({
							tableNumber: convertedValue,
							location: getLocationOrderUser.location,
							isPage: 'user_order',
						})
					)
					if (payload) {
						setShowMenu(payload.data)
					}
				} else {
					const { payload } = await dispatch(
						fetchMessageByUserRole({
							userId: getInforUser?.data?.userId,
							location: getLocationOrderUser.location,
							isPage: 'employee_active',
						})
					)
					if (payload) {
						setShowMenuEmployee(payload.data)
					}
				}
			}
		})()
		setIdTable(convertedValue)
	}, [router?.query])

	useEffect(() => {
		if (socket) {
			socket.emit('joinRoom', 'room')
			socket.on('responseEmployee', async (response) => {
				const itemWithLocation = response?.find(
					(item) => item?.location === getInforUser?.data?.location
				)
				if (itemWithLocation) {
					await dispatch(setMessageEmployee(response))
				}
			})
		}
	}, [socket])

	useEffect(() => {
		// let dataNoti
		// if (typeof window !== 'undefined') {
		// dataNoti = JSON.parse(localStorage.getItem('notification'))
		// }

		if (message !== null && isOrderPage) {
			setShowMessage(true)
			setShowMenu(message)
			setTimeout(() => {
				setShowMessage(false)
			}, 2000)
		}
		if (messageEmployee !== null && !isOrderPage) {
			setShowMessageEmployee(true)
			setShowMenuEmployee(messageEmployee)
			setTimeout(() => {
				setShowMessageEmployee(false)
			}, 2000)
		}
	}, [message, messageEmployee])

	const handleShowOptionMenu = () => {
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
					<a style={{ marginLeft: '5px', fontWeight: '600' }}>{ele.message}</a>
					<div style={{ fontSize: '12px' }}>
						<span>Thời gian: </span>
						<span>{moment(ele.dateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
					</div>
					<Link
						style={{ fontSize: '12px', color: 'blue' }}
						href={`/order/detail/${JSON.stringify(router.query)}`}
					>
						xem chi tiết
					</Link>
				</Menu.Item>
			))
		) : (
			<Menu.Item>No data</Menu.Item>
		)
	}
	const handleShowOptionMenuEmployee = () => {
		return showMenuEmployee?.length > 0 ? (
			showMenuEmployee.map((ele, index) => (
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
					<a style={{ marginLeft: '5px', fontWeight: '600' }}>{ele.message}</a>
					<div style={{ fontSize: '12px' }}>
						<span>Thời gian: </span>
						<span>{moment(ele.dateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
						{/* <span>{ele.dateTime}</span> */}
					</div>
					<p>
						Tại<b>{ele.location}</b>
					</p>
					<Link
						style={{ fontSize: '12px', color: 'blue' }}
						href={`/order/detail/${JSON.stringify(router.query)}`}
					>
						xem chi tiết
					</Link>
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
					{isOrderPage ? (
						<Dropdown
							dropdownRender={(menu) => (
								<Menu className="showScroll">
									<Menu.Item>
										<h5>Thông báo của bạn</h5>
									</Menu.Item>
									{handleShowOptionMenu()}
								</Menu>
							)}
							trigger={['click']}
						>
							<a onClick={(e) => e.preventDefault()}>
								{/* {isOrderPage ? ( */}
								<Space>
									{showMenu?.length > 0 ? (
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
									) : (
										<Badge style={{ display: 'flex' }}>
											<BellOutlined style={{ fontSize: '22px', width: '30px' }} />
										</Badge>
									)}
								</Space>
							</a>
						</Dropdown>
					) : (
						<Dropdown
							dropdownRender={(menu) => (
								<Menu className="showScroll">
									<Menu.Item>
										<h5>Thông báo của bạn</h5>
									</Menu.Item>
									{handleShowOptionMenuEmployee()}
								</Menu>
							)}
							trigger={['click']}
						>
							<a onClick={(e) => e.preventDefault()}>
								<Space>
									{showMenuEmployee?.length > 0 ? (
										<Tooltip
											placement="bottomLeft"
											title={'Bạn có thông báo mới'}
											color={'red'}
											key={'red'}
											open={showMessageEmployee}
										>
											<Badge
												dot={messageEmployee !== null ? 'show' : ''}
												style={{ display: 'flex' }}
											>
												<BellOutlined style={{ fontSize: '22px', width: '30px' }} />
											</Badge>
										</Tooltip>
									) : (
										<Badge style={{ display: 'flex' }}>
											<BellOutlined style={{ fontSize: '22px', width: '30px' }} />
										</Badge>
									)}
								</Space>
							</a>
						</Dropdown>
					)}
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
									{user?.data?.username || userRequest}
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
