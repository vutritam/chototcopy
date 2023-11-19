import React, { useEffect, useRef } from 'react'
import {
	DownOutlined,
	UserOutlined,
	LoginOutlined,
	LogoutOutlined,
	SettingOutlined,
	DownCircleOutlined,
	BellOutlined,
	EnvironmentOutlined,
	InfoCircleOutlined,
	PoweroffOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, Button, Menu, MenuProps } from 'antd'
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
	fetchMessageConfirmOrderByUser,
	fetchMessageFromServer,
	setMessage,
	setMessageAdmin,
	setMessageEmployee,
	updateMessageNotification,
} from '@/redux/componentSlice/messageSocketSlice'
import L10N from '../L10N/en.json'
import { decodeNumber, encodeNumber } from '../common/hashCode'
import { processRouterQuery } from '../common/parseNumber'
import moment from 'moment'
import { io } from 'socket.io-client'
import { fetchOrderByNumberTableAndLocation } from '@/redux/componentSlice/orderSlice'
import Toasty from '../common/toasty'
import { handleTextL10N } from '../helper/helper'
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
	const isEmployeePage = router.pathname.startsWith('/employee')
	//message redux store
	const message = useSelector((state: any) => state.message?.message?.data)
	const messageEmployee = useSelector((state: any) => state.message?.messageEmployee?.data)
	const messageAdmin = useSelector((state: any) => state.message?.messageAdmin?.data)

	const [userRequest, setUserRequest] = React.useState('')
	const [checkMessageByUserRole, setMessageByUserRole] = React.useState(null)
	const [showMessage, setShowMessage] = React.useState<Boolean>(false)
	const [countMessage, setCountMessage] = React.useState<Boolean>(0)
	const [countMessageEmployee, setCountMessageEmployee] = React.useState<Boolean>(0)
	const [idCheckConfirm, setCheckConfirm] = React.useState<String>('')
	const [showMessageEmployee, setShowMessageEmployee] = React.useState<Boolean>(false)
	const [showMessageAdmin, setShowMessageAdmin] = React.useState<Boolean>(false)
	const [countMessageAdmin, setCountMessageAdmin] = React.useState<Boolean>(0)
	const [loadingConfirmOrder, setLoadingConfirmOrder] = React.useState<Boolean>(false)
	const [convertedValue, setConvertvalue] = React.useState(null)
	// const [checkConfirmOrder, setCheckConfirmOrder] = React.useState<Boolean>(false)
	const [dataLocal, setDataLocal] = React.useState<Object>([
		{
			userInfo: {},
			dataNoti: [],
		},
	])
	const [socket, setSocket] = React.useState<any>(null)
	let getInforUser = JSON.parse(sessionStorage.getItem('user'))
	const elementBellOrder = useRef()
	const elementBellOrderEmployee = useRef()
	const elementBellAdmin = useRef()

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
			const ENV_HOST = process.env.NEXT_PUBLIC_HOST
			const newSocket = io(ENV_HOST)
			setSocket(newSocket)

			let obj = {
				userInfo: {},
				dataNoti: [],
			}

			let getDataUserInfo = JSON.parse(sessionStorage.getItem('user'))
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
		const idTable = processRouterQuery(router?.query)
		if (idTable) {
			setConvertvalue(idTable)
		}
	}, [router?.query])

	useEffect(() => {
		;(async () => {
			if (
				sessionStorage.getItem('location_user') !== null ||
				sessionStorage.getItem('user') !== null
			) {
				let getLocationOrderUser = JSON.parse(sessionStorage.getItem('location_user'))
				let getInforUser = JSON.parse(sessionStorage.getItem('user'))
				// if(getLocationOrderUser?.user)
				// if (isOrderPage) {

				if (isOrderPage) {
					const { payload } = await dispatch(
						fetchMessageFromServer({
							tableNumber: convertedValue,
							location: getLocationOrderUser?.location,
							isPage: 'user_order',
						})
					)
					if (payload) {
						setShowMessage(true)
						// setShowMenu(payload.data)
						setCountMessage(payload.data.length)

						setTimeout(() => {
							setShowMessage(false)
						}, 2000)
					}
				} else if (isEmployeePage) {
					const { payload } = await dispatch(
						fetchMessageByUserRole({
							userId: getInforUser?.data?.userId,
							location: getInforUser?.data?.location,
							isPage: 'user_order',
						})
					)
					console.log('vào nè', payload)

					if (payload) {
						setShowMessageEmployee(true)
						// setShowMenuEmployee(payload.data)
						setCountMessageEmployee(payload.data.length)
						setCountMessage(payload.data.length)
						setTimeout(() => {
							setShowMessageEmployee(false)
						}, 2000)
					}
				} else {
					const { payload } = await dispatch(
						fetchMessageByUserRole({
							userId: getInforUser?.data?.userId,
							location: getInforUser?.data?.location,
							isPage: 'admin_page',
						})
					)
					if (payload) {
						setShowMessageAdmin(true)
						// setShowMenuAdmin(payload.data)
						setCountMessage(payload.data.length)
						setCountMessageAdmin(payload.data.length)
						setTimeout(() => {
							setShowMessageAdmin(false)
						}, 2000)
					}
				}

				// } else {
				// 	const { payload } = await dispatch(
				// 		fetchMessageByUserRole({
				// 			userId: getInforUser?.data?.userId,
				// 			location: getInforUser.data.location,
				// 			isPage: 'employee_active',
				// 		})
				// 	)
				// 	if (payload) {
				// 		setShowMessageEmployee(true)
				// 		// setShowMenuEmployee(payload.data)
				// 		setCountMessage(payload.data.length)
				// 		setTimeout(() => {
				// 			setShowMessageEmployee(false)
				// 		}, 2000)
				// 	}
				// }
			}
		})()
		setIdTable(convertedValue)
	}, [message.data?.length, messageEmployee?.length, messageAdmin?.length])

	useEffect(() => {
		if (
			sessionStorage.getItem('location_user') !== null ||
			sessionStorage.getItem('user') !== null
		) {
			// let getInforUser = JSON.parse(sessionStorage.getItem('user'))
			if (socket) {
				socket.emit('joinRoom', 'room')
				socket.on('responseEmployee', async (response) => {
					if (response) {
						await dispatch(setMessageEmployee(response))
					}
				})
				socket.on('resAllItemNotification', async (response) => {
					if (response) {
						console.log(response, 'response')

						setLoadingConfirmOrder(false)
						setCheckConfirm('')
						await dispatch(setMessage(response))
						await dispatch(setMessageEmployee(response))
					}
				})
				socket.on('ResponseAfterUserLogin', async (response) => {
					console.log(response, 'adim')

					if (response) {
						setLoadingConfirmOrder(false)
						setCheckConfirm('')
						await dispatch(setMessageAdmin(response))
					}
				})
			}
		}
	}, [socket])

	const handleConfirmOrder = async (event, idItem: string) => {
		event.stopPropagation()
		setLoadingConfirmOrder(true)
		setCheckConfirm(idItem)
		if (socket) {
			// gửi sự kiện get sản phẩm
			socket.emit('getItemNotification', {
				idItem: idItem,
				status: 'order_success',
			})
		}
	}

	const handleShowOptionMenu = () => {
		return message?.data?.length > 0 ? (
			message?.data?.map((ele, index) => (
				<Menu.Item key={index} className={`${showMessage ? '' : 'show-readed-message'}`}>
					<div className="box-message">
						{ele.status === 'order_pending' ? (
							<div className="moving-shadow-dot" />
						) : (
							<DownCircleOutlined style={{ fontSize: '16px', color: 'rgb(43 215 0)' }} />
						)}
						<a style={{ marginLeft: '5px', fontWeight: '600' }}>
							{ele.status === 'order_pending' ? ele.message : 'Món của bạn đã được xác nhận'}
						</a>
					</div>

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
			<Menu.Item>{handleTextL10N(L10N['message.avatar.menuItem.nodata.text'], null)}</Menu.Item>
		)
	}
	const handleShowOptionMenuEmployee = () => {
		return messageEmployee?.length > 0 ? (
			messageEmployee.map((ele, index) => (
				<Menu.Item key={index} className={`${showMessageEmployee ? '' : 'show-readed-message'}`}>
					<DownCircleOutlined style={{ fontSize: '16px', color: 'rgb(43 215 0)' }} />
					<a style={{ marginLeft: '5px', fontWeight: '600' }}>
						{handleTextL10N(L10N['message.avatar.menuItem.text'], [ele.tableNumber])}
					</a>
					<div style={{ fontSize: '12px' }}>
						<span>Thời gian: </span>
						<span>{moment(ele.dateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
						{/* <span>{ele.dateTime}</span> */}
					</div>
					<p style={{ fontSize: '12px' }}>
						<b>{ele.location}</b>
					</p>
					<Link
						style={{ fontSize: '12px', color: 'blue' }}
						href={`/order/detail/${JSON.stringify(router.query)}`}
					>
						xem chi tiết
					</Link>
					{ele.status !== 'order_success' ? (
						<Button
							icon={<PoweroffOutlined />}
							loading={loadingConfirmOrder && idCheckConfirm === ele._id ? true : false}
							style={{ fontSize: '12px', color: 'blue', marginLeft: '10px' }}
							onClick={(event) => handleConfirmOrder(event, ele._id)}
						>
							Xác nhận
						</Button>
					) : (
						<span style={{ fontSize: '12px', color: 'green', marginLeft: '10px' }}>
							Đã xác nhận
						</span>
					)}
				</Menu.Item>
			))
		) : (
			<Menu.Item>{handleTextL10N(L10N['message.avatar.menuItem.nodata.text'], null)}</Menu.Item>
		)
	}

	const handleShowOptionMenuAdmin = () => {
		return messageAdmin?.length > 0 ? (
			messageAdmin.map((ele, index) => (
				<Menu.Item key={index} className={`${showMessageAdmin ? '' : 'show-readed-message'}`}>
					<DownCircleOutlined style={{ fontSize: '16px', color: 'rgb(43 215 0)' }} />
					<a style={{ marginLeft: '5px', fontWeight: '600' }}>
						<span style={{ color: 'blue' }}>{ele?.userId?.username}</span> vừa mới đăng nhập
					</a>
					<div style={{ fontSize: '12px' }}>
						<b>Ca: {ele?.workShiftId?.nameWork || 'trống'}</b>
					</div>
					<div style={{ fontSize: '12px' }}>
						<span>
							<b>Thời gian:</b>{' '}
						</span>
						<span>
							<b>{moment(ele.dateTime).format('YYYY-MM-DD HH:mm:ss')}</b>
						</span>
						{/* <span>{ele.dateTime}</span> */}
					</div>
					<p style={{ fontSize: '12px' }}>
						<b>Địa điểm: {ele.location}</b>
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
			<Menu.Item>{handleTextL10N(L10N['message.avatar.menuItem.nodata.text'], null)}</Menu.Item>
		)
	}
	const renderMenuMessage = () => {
		if (isOrderPage) {
			return (
				<Dropdown
					dropdownRender={(menu) => (
						<Menu className="showScroll">
							<Menu.Item>
								<h5>
									{handleTextL10N(L10N['message.avatar.menuItem.item.title'], [
										message?.data?.length,
									])}
								</h5>
							</Menu.Item>
							{handleShowOptionMenu()}
						</Menu>
					)}
					trigger={['click']}
					onClick={() => handleUpdateSeenMessage(true)}
				>
					<a onClick={(e) => e.preventDefault()}>
						{/* {isOrderPage ? ( */}
						<Space size="large">
							{message?.data?.length > 0 ? (
								<Tooltip
									placement="bottomLeft"
									title={'Bạn có thông báo mới'}
									color={'red'}
									key={'red'}
									open={showMessage}
								>
									<Badge count={countMessage > 10 ? `${10}+` : countMessage}>
										<BellOutlined
											ref={elementBellOrder}
											className="bell"
											style={{ fontSize: '22px', width: '30px' }}
										/>
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
			)
		} else if (isEmployeePage) {
			return (
				<Dropdown
					dropdownRender={(menu) => (
						<Menu className="showScroll">
							<Menu.Item>
								<h5>{handleTextL10N(L10N['message.avatar.menuItem.item.title'], [])}</h5>
							</Menu.Item>
							{handleShowOptionMenuEmployee()}
						</Menu>
					)}
					trigger={['click']}
					onClick={() => handleUpdateSeenMessage(true)}
				>
					<a onClick={(e) => e.preventDefault()}>
						<Space>
							{messageEmployee?.length > 0 ? (
								<Tooltip
									placement="bottomLeft"
									title={'Bạn có thông báo mới'}
									color={'red'}
									key={'red'}
									open={showMessageEmployee}
								>
									<Badge count={countMessage > 10 ? `${10}+` : countMessage}>
										<BellOutlined
											ref={elementBellOrderEmployee}
											className="bell"
											style={{ fontSize: '22px', width: '30px' }}
										/>
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
			)
		} else {
			return (
				<Dropdown
					dropdownRender={(menu) => (
						<Menu className="showScroll">
							<Menu.Item>
								<h5>{handleTextL10N(L10N['message.avatar.menuItem.item.title'], [])}</h5>
							</Menu.Item>
							{handleShowOptionMenuAdmin()}
						</Menu>
					)}
					trigger={['click']}
					onClick={() => handleUpdateSeenMessage(true)}
				>
					<a onClick={(e) => e.preventDefault()}>
						<Space>
							{messageAdmin?.length > 0 ? (
								<Tooltip
									placement="bottomLeft"
									title={handleTextL10N(L10N['message.avatar.modal.tooltip.title'], [])}
									color={'red'}
									key={'red'}
									open={showMessageAdmin}
								>
									<Badge count={countMessage > 10 ? `${10}+` : countMessage}>
										<BellOutlined
											ref={elementBellAdmin}
											className="bell"
											style={{ fontSize: '22px', width: '30px' }}
										/>
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
			)
		}
	}
	console.log(showMessageEmployee, 'messageEmployee?.length')

	// console.log(showMenuEmployee, 'showMenu?.length')
	const handleUpdateSeenMessage = async (params) => {
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

		// setCheckConfirmOrder(true)
		await dispatch(
			updateMessageNotification({
				checkSeen: params,
			})
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
				<Space wrap>{renderMenuMessage()}</Space>
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
