import React, { useEffect, useRef } from 'react'
import {
	DownOutlined,
	UserOutlined,
	LoginOutlined,
	LogoutOutlined,
	SettingOutlined,
	EnvironmentOutlined,
} from '@ant-design/icons'
import { Avatar, MenuProps } from 'antd'
import { Dropdown, Space, Tooltip } from 'antd'
import CartItem from '../main/cartItem'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import _ from 'lodash'
import Link from 'next/link'
import { fetchUserById } from '@/redux/componentSlice/userSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { fetchMessageByUserRole } from '@/redux/componentSlice/messageSocketSlice'
import { processRouterQuery } from '../common/parseNumber'
import { io } from 'socket.io-client'
import {
	fetchAllOrderByNumberTableAndLocationUser,
	fetchOrderByNumberTable,
	setIdNotiConfirm,
	setOrderByNumberTable,
	fetchAllOrder,
	setMessage,
	setMessageEmployee,
	setMessageAdmin,
} from '@/redux/componentSlice/orderSlice'
import useSound from 'use-sound'
const notificationSoundPath = '/sound/am-thanh-thong-bao-messenger-www_hieuung_com.mp3'
import HelperMessageToolTip from './helper/avatarTooltip'
import { CONST_TYPE_KEY_VALUE, CONST_TYPE_SOCKET } from '@/constanst/constanst.const'
import Toasty from '../common/toasty'

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
	{
		label: (
			<Link className="style-menu" href="/employee/account">
				<UserOutlined />
				Tài khoản cá nhân
			</Link>
		),
		key: '2',
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
	const [messageOrder, setMessageOrder] = React.useState<string>('')
	const user = useSelector((state: any) => state.user.account.user)
	const isOrderPage = router.pathname.startsWith('/order')
	const isEmployeePage = router.pathname.startsWith('/employee')
	//message redux store
	const message = useSelector((state: any) => state.dataOrder?.message?.data)
	const messageEmployee = useSelector((state: any) => state.dataOrder?.messageEmployee?.data)
	const messageAdmin = useSelector((state: any) => state.dataOrder?.messageAdmin?.data)

	const [userRequest, setUserRequest] = React.useState('')
	const [showMessage, setShowMessage] = React.useState<Boolean>(false)
	const [countMessage, setCountMessage] = React.useState<number>(0)
	const [showMessageEmployee, setShowMessageEmployee] = React.useState<Boolean>(false)
	const [showMessageAdmin, setShowMessageAdmin] = React.useState<Boolean>(false)
	const itemOrder = useSelector((state: any) => state.dataOrder?.dataOrderByNumberTable?.data)
	const itemAllOrder = useSelector((state: any) => state.dataOrder?.dataAllOrder?.data)
	const [orderSummary, setOrderSummary] = React.useState({})
	const [dataLocal, setDataLocal] = React.useState<Object>([
		{
			userInfo: {},
			dataNoti: [],
		},
	])
	const [socket, setSocket] = React.useState<any>(null)
	const elementBellOrder = useRef()
	const elementBellOrderEmployee = useRef()
	const elementBellAdmin = useRef()
	const [playNotification, { sound }] = useSound(notificationSoundPath)
	const ENV_HOST = process.env.NEXT_PUBLIC_HOST

	let getLocationOrderUser = JSON.parse(sessionStorage.getItem('location_user'))
	let getInforUser = JSON.parse(sessionStorage.getItem('user'))

	const handleLogOut = () => {
		if (sessionStorage.getItem('user') !== null) {
			sessionStorage.removeItem('user')
			router.push('/login')
		} else {
			router.push('/login')
		}
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

	const onSetDataLocal = (data: propsData, callback: Function) => {
		const { userInfo, dataNoti } = data
		setDataLocal({ userInfo: userInfo, dataNoti: dataNoti })

		// Gọi callback (nếu có)
		if (typeof callback === 'function') {
			callback(data)
		}
	}

	const handleGetQuantityByTableNumber = (itemOrder) => {
		// Sử dụng Lodash để nhóm lại các đơn hàng theo bàn
		const groupedOrders =
			itemOrder !== null && typeof itemOrder === 'object' && !Array.isArray(itemOrder)
				? _.groupBy(itemOrder.data, 'tableNumber')
				: _.groupBy(itemOrder, 'tableNumber')

		// Tạo đối tượng tổng hợp thông tin
		const summary = _.mapValues(groupedOrders, (tableOrders) => {
			const totalOrderedItems = tableOrders.length || 0
			const confirmedItems =
				tableOrders.filter(
					(order) => order.status === 'order_success' || order.status === 'order_done'
				).length || 0
			const canceledItems =
				tableOrders.filter((order) => order.status === 'order_deleted').length || 0
			sessionStorage.setItem(
				'warning_text_order',
				JSON.stringify({
					totalOrderedItems: totalOrderedItems,
					confirmedItems: confirmedItems,
					canceledItems: canceledItems,
				})
			)
			return { totalOrderedItems, confirmedItems, canceledItems }
		})

		return summary
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

	useEffect(() => {
		if (messageOrder) {
			Toasty.error(messageOrder)
		}
	}, [messageOrder])

	useEffect(() => {
		const idTableQuery = processRouterQuery(router?.query?.order)
		if (idTableQuery) {
			setIdTable(idTableQuery)
		}
	}, [router.query])

	const handleCallApiRender = async (idTable) => {
		if (isOrderPage) {
			const item = sessionStorage.getItem('warning_text_order')
			if (item && message?.length <= 0) {
				sessionStorage.removeItem('warning_text_order')
			}
			const { payload } = await dispatch(
				fetchAllOrderByNumberTableAndLocationUser({
					tableNumber: idTable,
					locationId: getLocationOrderUser?.locationId,
				})
			)

			if (payload) {
				setShowMessage(true)
				await dispatch(setMessage(payload.data))
				// setShowMenu(payload.data)
				setCountMessage(payload.data.length)

				setTimeout(() => {
					setShowMessage(false)
				}, 2000)
			}
		} else if (isEmployeePage) {
			const { payload } = await dispatch(
				fetchAllOrder({
					locationId: getInforUser?.data.locationId,
				})
			)

			if (payload) {
				setShowMessageEmployee(true)
				await dispatch(setMessageEmployee(payload.data))
				setCountMessage(payload.data.length)
				setTimeout(() => {
					setShowMessageEmployee(false)
				}, 2000)
			}
		} else {
			const { payload } = await dispatch(
				fetchMessageByUserRole({
					userId: getInforUser?.data?.userId,
					locationId: getInforUser?.data?.locationId,
					isPage: CONST_TYPE_KEY_VALUE.Admin_page,
				})
			)
			if (payload) {
				setShowMessageAdmin(true)
				await dispatch(setMessageAdmin(payload.data))
				setCountMessage(payload.data.length)
				setTimeout(() => {
					setShowMessageAdmin(false)
				}, 2000)
			}
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			let obj = {
				userInfo: {},
				dataNoti: [],
			}

			if (typeof window !== 'undefined') {
				obj.userInfo = getInforUser?.data
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
			handleCallApiRender(idTable)
		}
		fetchData()
	}, [
		JSON.stringify(message),
		JSON.stringify(messageEmployee),
		JSON.stringify(messageAdmin),
		idTable,
	])

	useEffect(() => {
		let summary
		if (isOrderPage) {
			summary = handleGetQuantityByTableNumber(itemOrder)
		} else if (isEmployeePage) {
			summary = handleGetQuantityByTableNumber(itemAllOrder)
		}
		setOrderSummary(summary)
	}, [itemOrder, itemAllOrder])

	useEffect(() => {
		if (socket) {
			let roomName
			if (isOrderPage) {
				roomName = `room-${idTable}-${getLocationOrderUser?.locationId}`
			} else if (isEmployeePage) {
				roomName = `room-${getInforUser?.data?.locationId}`
			} else {
				roomName = 'room'
			}
			socket.emit(CONST_TYPE_SOCKET.JoinRoom, roomName)
			socket.on(CONST_TYPE_SOCKET.Response, async (response) => {
				console.log(response.data, 'employee')

				if (response.data.length > 0) {
					await dispatch(setMessage(response.data))
					playNotification()
				} else {
					setMessageOrder(response.message)
				}
			})
			socket.on(CONST_TYPE_SOCKET.ResponseEmployee, async (response) => {
				if (response.data.length > 0) {
					await dispatch(setMessageEmployee(response.data))
					playNotification()
				}
			})
			socket.on(CONST_TYPE_SOCKET.ResponseAfterUserLogin, async (response) => {
				if (response) {
					await dispatch(setMessageAdmin(response))
				}
				playNotification()
			})
			socket.on(CONST_TYPE_SOCKET.ResAllOrderByStatus, async (response) => {
				if (response) {
					await dispatch(setOrderByNumberTable(response))
				}
				playNotification()
			})
		}
	}, [socket, getLocationOrderUser, getInforUser])

	const handleConfirmOrder = async (event, item: any) => {
		event.stopPropagation()
		await dispatch(setIdNotiConfirm(item._id))
		await dispatch(
			fetchOrderByNumberTable({
				tableNumber: item.tableNumber,
				locationId: getInforUser?.data?.locationId,
			})
		)
		router.push('/employee/order')
		sessionStorage.setItem('clickItemChecked', '3')
	}

	const renderMenuMessage = () => {
		if (isOrderPage) {
			return (
				<HelperMessageToolTip
					dataMessage={message}
					showMessage={showMessage}
					countMessage={countMessage}
					orderSummary={orderSummary}
					handleUpdateSeenMessage={handleUpdateSeenMessage}
					condition={CONST_TYPE_KEY_VALUE.UserOrder}
					elementBellOrder={elementBellOrder}
					handleConfirmOrder={handleConfirmOrder}
				/>
			)
		} else if (isEmployeePage) {
			return (
				<HelperMessageToolTip
					dataMessage={messageEmployee}
					showMessage={showMessageEmployee}
					countMessage={countMessage}
					orderSummary={orderSummary}
					handleUpdateSeenMessage={handleUpdateSeenMessage}
					condition={CONST_TYPE_KEY_VALUE.Employee}
					elementBellOrder={elementBellOrderEmployee}
					handleConfirmOrder={handleConfirmOrder}
				/>
			)
		} else {
			return (
				<HelperMessageToolTip
					dataMessage={messageAdmin}
					showMessage={showMessageAdmin}
					countMessage={countMessage}
					orderSummary={orderSummary}
					handleUpdateSeenMessage={handleUpdateSeenMessage}
					condition={CONST_TYPE_KEY_VALUE.Admin}
					elementBellOrder={elementBellAdmin}
					handleConfirmOrder={handleConfirmOrder}
				/>
			)
		}
	}

	const handleUpdateSeenMessage = async () => {
		if (isOrderPage) {
			const element = elementBellOrder.current
			elementBellOrder.current && element.classList.remove('bell')
		} else if (isEmployeePage) {
			const element = elementBellOrderEmployee.current
			elementBellOrderEmployee.current && element.classList.remove('bell')
		} else {
			const element = elementBellAdmin.current
			elementBellAdmin.current && element.classList.remove('bell')
		}
		setCountMessage(0)
		setShowMessage(false)
	}

	return (
		<div className="flex-box-basic">
			<div className="flex-box-basic">
				<Tooltip title="Tìm kiếm khu vực tại đây" color={'red'} key={'red'}>
					<EnvironmentOutlined style={{ fontSize: '22px', width: '30px', display: 'flex' }} />
				</Tooltip>
				Địa điểm
			</div>

			<Space wrap className="screen-mobile">
				{renderMenuMessage()}
			</Space>
			<Space wrap className="screen-mobile">
				<CartItem className="screen-mobile" />
			</Space>
			<div className="show-desktop-menu">
				{/* <SelectSearch /> */}

				<Space wrap>{renderMenuMessage()} Thông báo</Space>
				{isOrderPage ? (
					''
				) : (
					<Space wrap>
						<Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
							<a onClick={(e) => e.preventDefault()} style={{ color: '#050354' }}>
								<Space>
									<Avatar
										style={{ backgroundColor: '#87d068' }}
										icon={<UserOutlined />}
										src={process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/${user?.data?.file}`}
									/>
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
