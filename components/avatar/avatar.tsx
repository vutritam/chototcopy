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
import {
	fetchAllOrderByNumberTableAndLocationUser,
	fetchOrderByNumberTable,
	fetchOrderByNumberTableAndLocation,
	setIdNotiConfirm,
	setOrderByNumberTable,
	fetchAllOrder,
} from '@/redux/componentSlice/orderSlice'
import Toasty from '../common/toasty'
import { handleTextL10N, sortByStatus } from '../helper/helper'
import ModalCommonOrderByNumberTable from '../common/modalConfirmOrderByMessage'
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
	const itemOrder = useSelector((state: any) => state.dataOrder?.dataOrderByNumberTable?.data)
	const itemAllOrder = useSelector((state: any) => state.dataOrder?.dataAllOrder?.data)
	const [orderSummary, setOrderSummary] = React.useState({})
	const [dataOrderOrigin, setDataOrderOrigin] = React.useState<Boolean>(0)
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

	const handleGetQuantityByTableNumber = (itemOrder) => {
		// Logic đếm giống như trong ví dụ trước đó
		// Sử dụng Lodash để nhóm lại các đơn hàng theo bàn
		const groupedOrders =
			itemOrder !== null && typeof itemOrder === 'object' && !Array.isArray(itemOrder)
				? _.groupBy(itemOrder.data, 'tableNumber')
				: _.groupBy(itemOrder, 'tableNumber')

		// Tạo đối tượng tổng hợp thông tin
		const summary = _.mapValues(groupedOrders, (tableOrders) => {
			const totalOrderedItems = tableOrders.length
			const confirmedItems = tableOrders.filter((order) => order.status === 'order_success').length

			return { totalOrderedItems, confirmedItems }
		})

		return summary
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
			let getLocationOrderUser = JSON.parse(sessionStorage.getItem('location_user'))
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
			await dispatch(
				fetchAllOrderByNumberTableAndLocationUser({
					tableNumber: idTable,
					location: getLocationOrderUser?.location,
				})
			)
			await dispatch(
				fetchAllOrder({
					location: getDataUserInfo?.data.location,
				})
			)

			return () => {
				newSocket.disconnect()
			}
		})()
	}, [idTable])

	useEffect(() => {
		const idTable = processRouterQuery(router?.query)
		if (idTable) {
			setIdTable(idTable)
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
							tableNumber: idTable,
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
				await dispatch(
					fetchAllOrder({
						location: getInforUser?.data.location,
					})
				)
			}
		})()
	}, [message.data?.length, messageEmployee?.length, messageAdmin?.length, idTable, itemOrder])

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
		if (
			sessionStorage.getItem('location_user') !== null ||
			sessionStorage.getItem('user') !== null
		) {
			let getLocationOrderUser = JSON.parse(sessionStorage.getItem('location_user'))
			let getInforUser = JSON.parse(sessionStorage.getItem('user'))
			// let getInforUser = JSON.parse(sessionStorage.getItem('user'))
			if (socket) {
				let roomName = `room-${idTable}-${
					isOrderPage ? getLocationOrderUser.location : getInforUser.data.location
				}`

				socket.emit('joinRoom', roomName)
				socket.on('responseEmployee', async (response) => {
					if (response) {
						await dispatch(setMessageEmployee(response))
					}
				})
				socket.on('resAllItemNotification', async (response) => {
					if (response) {
						setLoadingConfirmOrder(false)
						setCheckConfirm('')
						await dispatch(setMessage(response))
						await dispatch(setMessageEmployee(response))
					}
				})
				socket.on('ResponseAfterUserLogin', async (response) => {
					if (response) {
						setLoadingConfirmOrder(false)
						setCheckConfirm('')
						await dispatch(setMessageAdmin(response))
					}
				})
				socket.on('resAllOrderByStatus', async (response) => {
					if (response) {
						await dispatch(setOrderByNumberTable(response))
					}
				})
			}
		}
	}, [socket])

	const handleConfirmOrder = async (event, item: any) => {
		event.stopPropagation()
		setLoadingConfirmOrder(true)
		await dispatch(setIdNotiConfirm(item._id))
		setCheckConfirm(item._id)
		await dispatch(
			fetchOrderByNumberTable({
				tableNumber: item.tableNumber,
			})
		)
	}

	const handleShowOptionMenu = () => {
		return message?.data?.length > 0 ? (
			sortByStatus(message?.data, 'order_pending')?.map((ele, index) => (
				<Menu.Item key={index} className={`${showMessage ? '' : 'show-readed-message'}`}>
					<div className="box-message">
						{ele.status === 'order_pending' &&
						orderSummary[ele.tableNumber]?.totalOrderedItems !==
							orderSummary[ele.tableNumber]?.confirmedItems ? (
							<div className="moving-shadow-dot" />
						) : (
							<DownCircleOutlined style={{ fontSize: '16px', color: 'rgb(43 215 0)' }} />
						)}
						<a style={{ marginLeft: '5px', fontWeight: '600' }}>
							{ele.status === 'order_pending' &&
							orderSummary[ele.tableNumber]?.totalOrderedItems !==
								orderSummary[ele.tableNumber]?.confirmedItems
								? ele.message
								: 'Món của bạn đã được xác nhận'}
						</a>
					</div>
					<div style={{ fontSize: '14px' }}>
						<span>Số lượng món: </span>
						<span style={{ fontWeight: 'bold', color: 'blue' }}>
							{orderSummary[ele.tableNumber]?.totalOrderedItems}
						</span>
					</div>
					<div style={{ fontSize: '14px' }}>
						<span>Số lượng món đã xác nhận: </span>
						<span style={{ fontWeight: 'bold', color: 'blue' }}>
							{orderSummary[ele.tableNumber]?.confirmedItems}
						</span>
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
			sortByStatus(messageEmployee, 'order_pending').map((ele, index) => (
				<Menu.Item key={index} className={`${showMessageEmployee ? '' : 'show-readed-message'}`}>
					<div className="box-message">
						{ele.status === 'order_pending' &&
						orderSummary[ele.tableNumber]?.totalOrderedItems !==
							orderSummary[ele.tableNumber]?.confirmedItems ? (
							<div className="moving-shadow-dot" />
						) : (
							<DownCircleOutlined style={{ fontSize: '16px', color: 'rgb(43 215 0)' }} />
						)}
						<a style={{ marginLeft: '5px', fontWeight: '600' }}>
							{ele.status === 'order_pending'
								? handleTextL10N(L10N['message.avatar.menuItem.text'], [ele.tableNumber])
								: 'Bạn đã xác nhận'}
						</a>
					</div>
					<div style={{ fontSize: '12px' }}>
						<span>Thời gian: </span>
						<span>{moment(ele.dateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
					</div>

					<div style={{ fontSize: '14px' }}>
						<span>Số lượng món: </span>
						<span style={{ fontWeight: 'bold', color: 'blue' }}>
							{orderSummary[ele.tableNumber]?.totalOrderedItems}
						</span>
					</div>
					<div style={{ fontSize: '14px' }}>
						<span>Số lượng món đã xác nhận: </span>
						<span style={{ fontWeight: 'bold', color: 'blue' }}>
							{orderSummary[ele.tableNumber]?.confirmedItems}
						</span>
					</div>

					<p style={{ fontSize: '12px' }}>
						<b>Địa điểm: {ele.location}</b>
					</p>
					{orderSummary[ele.tableNumber]?.totalOrderedItems !==
					orderSummary[ele.tableNumber]?.confirmedItems ? (
						<Button onClick={(event) => handleConfirmOrder(event, ele)}>Tìm kiếm nhanh</Button>
					) : null}

					{ele.status !== 'order_success' &&
					orderSummary[ele.tableNumber]?.totalOrderedItems !==
						orderSummary[ele.tableNumber]?.confirmedItems ? (
						<span style={{ fontSize: '12px', color: 'red', marginLeft: '10px' }}>
							Chưa xác nhận
						</span>
					) : (
						// <Button
						// 	icon={<PoweroffOutlined />}
						// 	loading={loadingConfirmOrder && idCheckConfirm === ele._id ? true : false}
						// 	style={{ fontSize: '12px', color: 'blue', marginLeft: '10px' }}
						// 	onClick={(event) => handleConfirmOrder(event, ele._id)}
						// >
						// 	chưa Xác nhận
						// </Button>
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
					placement="bottomLeft"
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
									<Badge count={messageEmployee?.length > 10 ? `${10}+` : messageEmployee?.length}>
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

			<Space wrap className="screen-mobile">
				{renderMenuMessage()}
			</Space>
			<Space wrap className="screen-mobile">
				<CartItem className="screen-mobile" />
			</Space>
			<div className="show-desktop-menu">
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
