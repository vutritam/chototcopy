import React, { useEffect, useState } from 'react'
import { Button, Drawer, Dropdown, Space, Spin, Tooltip } from 'antd'
import ListUser from './listUser'
import Link from 'next/link'
import {
	ShoppingCartOutlined,
	MenuUnfoldOutlined,
	DesktopOutlined,
	LeftOutlined,
	CloseOutlined,
	TeamOutlined,
} from '@ant-design/icons'
import { MenuProps, Menu } from 'antd'
import BillExport from '../BtnExport/btnBillExport'
import {
	fetchAllOrder,
	fetchAllOrderByNumberTableAndLocationUser,
	fetchAllOrderByUserRole,
	fetchOrderByNumberTable,
	updatePaymentForTableNumber,
} from '@/redux/componentSlice/orderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Label } from 'semantic-ui-react'
import { ThunkDispatch } from '@reduxjs/toolkit'
import CoffeeBill from '../exportBill/exportBill'
import ModalBill from '../exportBill/component/modalBill'
import { localDataWithCustomDataForBillUtil } from '../utilsComponent/customDataUtil'
import EventEmitter from 'events'
import { useRouter } from 'next/router'
import { itemsAdmin, itemsEmployee, itemsOrder } from '../jsonData/menuData'
type MenuItem = Required<MenuProps>['items'][number]

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem
}

interface Product {
	productId: string
	price: number
	status: string
	isPaid: boolean
	// Các thuộc tính khác của product nếu có
}

// Định nghĩa kiểu dữ liệu cho mảng dataSubmit
interface DataSubmitItem {
	productId: Product
	// Các thuộc tính khác của dataSubmitItem nếu có
}
interface ObjectType {
	_id: string
	tableNumber: number
}

const CartItem: React.FC = (props) => {
	const { className } = props
	const router = useRouter()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const [open, setOpen] = React.useState<Boolean>(false)
	const [openModalBill, setOpenBill] = React.useState<Boolean>(false)
	const [items, setMappedData] = useState<ObjectType[]>([])
	const [typeBill, setTypeBill] = React.useState<string>('')
	const [itemRender, setItemRender] = React.useState<any>([])
	const [dataSubmit, setDataSubmit] = React.useState<any>([])
	const [totalPrice, setTotalPrice] = React.useState<any>(0)
	const [confirmTableNumber, setConfirmTableNumber] = React.useState<any>(null)
	const itemAllOrder = useSelector((state: any) => state.dataOrder?.dataAllOrder?.data)
	// console.log(findItemOrderSuccess, 'k')

	let getLocationEmployee =
		sessionStorage.getItem('user') !== null && JSON.parse(sessionStorage.getItem('user') || '')

	// const itemsOrder: MenuItem[] = [
	// 	getItem(
	// 		<Link href={typeof window !== 'undefined' && window.location.pathname}>Thực đơn</Link>,
	// 		'1',
	// 		<DesktopOutlined />
	// 	),
	// 	getItem('Khuyến mãi', 'sub2', <TeamOutlined />, [
	// 		getItem('Team 1', '2'),
	// 		getItem('Team 2', '3'),
	// 	]),
	// 	getItem('Ăn vặt', 'sub3', <TeamOutlined />, [getItem('Team 1', '4'), getItem('Team 2', '5')]),
	// ]

	const dataNorMal = [
		{
			title: 'Ant Design Title 1',
		},
		{
			title: 'Ant Design Title 2',
		},
		{
			title: 'Ant Design Title 3',
		},
		{
			title: 'Ant Design Title 4',
		},
	]
	const dataRed = [
		{
			title: 'Ant Design Title red bill',
		},
		{
			title: 'Ant Design Title red bill',
		},
		{
			title: 'Ant Design Title red bill',
		},
		{
			title: 'Ant Design Title red bill',
		},
	]

	let getInforUser = JSON.parse(sessionStorage.getItem('user'))
	useEffect(() => {
		if (confirmTableNumber !== null) {
			const fetch = async () => {
				const { payload } = await dispatch(
					fetchOrderByNumberTable({
						tableNumber: confirmTableNumber,
						locationId: getInforUser?.data?.locationId,
					})
				)
				if (payload?.success) {
					const filterData = payload?.data?.filter(
						(item: Product) =>
							item?.status !== 'order_inprogess' &&
							item?.status !== 'order_deleted' &&
							!item?.isPaid
					)
					setDataSubmit(filterData)
				}
			}
			fetch()
		}
	}, [confirmTableNumber])

	useEffect(() => {
		const totalPrice = dataSubmit.reduce((acc: number, curr: DataSubmitItem) => {
			acc += curr.productId.price

			return acc
		}, 0)
		setTotalPrice(totalPrice)
	}, [dataSubmit])

	const handleConfirmPayment = async (tableNumber: number) => {
		const { payload } = await dispatch(
			updatePaymentForTableNumber({
				tableNumber: tableNumber,
				objValues: { isPaid: true },
			})
		)
		if (payload.success) {
			let obj = {
				locationId: getLocationEmployee?.data?.locationId,
			}

			const { payload } = await dispatch(fetchAllOrder(obj))
			if (payload?.success) {
			}

			// setMappedData([])
		}
	}

	const handleEventFromA = () => {
		let data
		if (open && open !== undefined) {
			data = localDataWithCustomDataForBillUtil(itemAllOrder, setConfirmTableNumber, open)
		} else {
			data = localDataWithCustomDataForBillUtil(itemAllOrder, handleConfirmPayment)
		}
		setMappedData(data)
	}
	const eventEmitter = new EventEmitter()

	useEffect(() => {
		// Đăng ký sự kiện khi component C được mount
		// Đăng ký sự kiện từ Component A
		eventEmitter.on('refreshData', handleEventFromA)

		// Hủy đăng ký sự kiện khi component C bị unmount
		return () => {
			eventEmitter.off('refreshData', handleEventFromA)
		}
	}, [])

	useEffect(() => {
		handleEventFromA()
	}, [itemAllOrder, open])

	const showDrawer = (condition: string) => {
		if (!!condition && condition === 'billNormal') {
			setItemRender(dataNorMal)
		} else if (!!condition && condition === 'billRed') {
			setItemRender(dataRed)
		}
		setTypeBill(condition)
		setOpen(true)
	}

	const handleShowBill = () => {
		setOpenBill(!openModalBill)
	}

	const onClose = () => {
		setOpen(false)
		setItemRender([])
		setConfirmTableNumber(null)
		setDataSubmit([])
	}

	const handleBackModal = () => {
		setConfirmTableNumber(null)
	}

	const CustomCloseIcon = () => {
		return confirmTableNumber !== null ? (
			<LeftOutlined onClick={handleBackModal} />
		) : (
			<CloseOutlined onClick={onClose} />
		)
	}

	const renderItemMenuMobile = (pathName) => {
		const menuMobile = [
			{ key: '/order', value: 'order' },
			{ key: '/employee', value: 'employee' },
			{ key: '/admin', value: 'admin' },
		]
		let pathNameRoles = menuMobile.find((e) => pathName.startsWith(e.key))?.value
		switch (pathNameRoles) {
			case 'order':
				return itemsOrder
			case 'employee':
				return itemsEmployee
			default:
				return itemsAdmin
		}
	}

	return (
		<>
			{className === 'screen-mobile' ? (
				<MenuUnfoldOutlined
					style={{ fontSize: '22px', width: '30px', display: 'flex' }}
					onClick={showDrawer}
				/>
			) : className === 'exportBill' ? (
				<BillExport showDrawer={showDrawer} items={items} />
			) : (
				<ShoppingCartOutlined
					className="style_cart"
					style={{ fontSize: '22px', width: '30px', display: 'flex' }}
					onClick={showDrawer}
				/>
			)}

			<Drawer
				title={
					(className && className !== 'screen-mobile') || className === 'exportBill' ? (
						`${
							className === 'exportBill' && confirmTableNumber !== null
								? typeBill === 'billNormal'
									? `Hóa đơn thường (Bàn số ${confirmTableNumber})`
									: `Hóa đơn đỏ (Bàn số ${confirmTableNumber})`
								: ''
						}`
					) : (
						<b style={{ color: 'blue' }}>GOLD COFFEE</b>
					)
				}
				placement="right"
				closeIcon={<CustomCloseIcon />}
				open={open}
			>
				<Space direction="vertical" style={{ width: '100%' }}>
					{className && className === 'screen-mobile' ? (
						<Menu mode={'inline'} theme={'light'} items={renderItemMenuMobile(router.asPath)} />
					) : className === 'exportBill' ? (
						<div>
							{confirmTableNumber !== null ? (
								dataSubmit?.length > 0 ? (
									<div>
										<div>
											<ListUser data={dataSubmit} />
										</div>

										<div className="">
											<div className="flex-box">
												<h2>Tổng tiền</h2>
												<h3>{totalPrice}Đ</h3>
											</div>
											<ModalBill
												open={openModalBill}
												handleShowBill={handleShowBill}
												dataSubmit={dataSubmit}
												totalPrice={totalPrice}
											/>
										</div>
									</div>
								) : (
									<Spin tip="Loading">
										<div className="content" />
									</Spin>
								)
							) : (
								<Dropdown menu={{ items }} placement="bottom" arrow>
									<Button style={{ width: '100%' }}>Chọn bàn in hóa đơn</Button>
								</Dropdown>
							)}
						</div>
					) : (
						<div>
							<div>Chưa hỗ trợ</div>
						</div>
					)}
				</Space>
			</Drawer>
		</>
	)
}

export default CartItem
