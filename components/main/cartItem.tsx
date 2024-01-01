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
import BillExport from '../srcExportBill/modalBillExport'
import {
	fetchAllOrder,
	fetchAllOrderByNumberTableAndLocationUser,
	fetchOrderByNumberTable,
} from '@/redux/componentSlice/orderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Label } from 'semantic-ui-react'
import { ThunkDispatch } from '@reduxjs/toolkit'
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
const CartItem: React.FC = (props) => {
	const { className } = props
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const [open, setOpen] = React.useState<Boolean>(false)
	const [backModal, setBackModal] = React.useState<Boolean>(false)
	const [typeBill, setTypeBill] = React.useState<string>('')
	const [itemRender, setItemRender] = React.useState<any>([])
	const [dataSubmit, setDataSubmit] = React.useState<any>([])
	const [totalPrice, setTotalPrice] = React.useState<any>(0)
	const [confirmTableNumber, setConfirmTableNumber] = React.useState<any>(null)
	const itemAllOrder = useSelector((state: any) => state.dataOrder?.dataAllOrder?.data)

	const itemsOrder: MenuItem[] = [
		getItem(
			<Link href={typeof window !== 'undefined' && window.location.pathname}>Thực đơn</Link>,
			'1',
			<DesktopOutlined />
		),
		getItem('Khuyến mãi', 'sub2', <TeamOutlined />, [
			getItem('Team 1', '2'),
			getItem('Team 2', '3'),
		]),
		getItem('Ăn vặt', 'sub3', <TeamOutlined />, [getItem('Team 1', '4'), getItem('Team 2', '5')]),
	]
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
	// call api get all order by tableNumber and location
	// const items = [
	// 	{
	// 		key: '1',
	// 		label: <p onClick={() => setConfirmTableNumber(1)}>Bàn 1</p>,
	// 	},
	// 	{
	// 		key: '2',
	// 		label: <p onClick={() => setConfirmTableNumber(2)}>Bàn 2</p>,
	// 	},
	// ]
	let getInforUser = JSON.parse(sessionStorage.getItem('user'))
	useEffect(() => {
		if (confirmTableNumber !== null) {
			const fetch = async () => {
				const { payload } = await dispatch(
					fetchOrderByNumberTable({
						tableNumber: confirmTableNumber,
						location: getInforUser?.data?.location,
					})
				)
				if (payload.success) {
					setDataSubmit(payload.data)
				}
			}
			fetch()
		}
	}, [confirmTableNumber])

	useEffect(() => {
		const totalPrice = dataSubmit.reduce((acc, curr) => {
			acc += curr.productId.price

			return acc
		}, 0)
		setTotalPrice(totalPrice)
	}, [dataSubmit])
	const [items, setMappedData] = useState([])
	useEffect(() => {
		const data =
			itemAllOrder !== null && typeof itemAllOrder === 'object' && !Array.isArray(itemAllOrder)
				? itemAllOrder.data
				: itemAllOrder
		const filteredData = data?.reduce((acc, curr) => {
			const index = acc.findIndex((item) => item.tableNumber === curr.tableNumber)
			if (index === -1) {
				acc.push(curr)
			}
			return acc
		}, [])

		const dataList = filteredData?.map((item, index) => ({
			key: index,
			label: (
				<p onClick={() => setConfirmTableNumber(item.tableNumber)}>{`Bàn ${item.tableNumber}`}</p>
			),
		}))
		setMappedData(dataList)
	}, [itemAllOrder])

	const showDrawer = (condition) => {
		if (!!condition && condition === 'billNormal') {
			setItemRender(dataNorMal)
		} else if (!!condition && condition === 'billRed') {
			setItemRender(dataRed)
		}
		setTypeBill(condition)
		setOpen(true)
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

	return (
		<>
			<Tooltip title="Bạn có 23 sản phẩm" color={'red'} key={'red'}>
				{className === 'screen-mobile' ? (
					<MenuUnfoldOutlined
						style={{ fontSize: '22px', width: '30px', display: 'flex' }}
						onClick={showDrawer}
					/>
				) : className === 'exportBill' ? (
					<BillExport showDrawer={showDrawer} />
				) : (
					<ShoppingCartOutlined
						className="style_cart"
						style={{ fontSize: '22px', width: '30px', display: 'flex' }}
						onClick={showDrawer}
					/>
				)}
			</Tooltip>

			<Drawer
				title={
					(className && className !== 'screen-mobile') || className === 'exportBill' ? (
						`${
							className === 'exportBill' && confirmTableNumber !== null
								? typeBill === 'billNormal'
									? `Hóa đơn thường (Bàn số ${confirmTableNumber})`
									: `Hóa đơn đỏ (Bàn số ${confirmTableNumber})`
								: `Thông tin giỏ hàng (23)`
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
						<Menu mode={'inline'} theme={'light'} items={itemsOrder} />
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
											<Button type="primary" block>
												Thanh toán
											</Button>
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
