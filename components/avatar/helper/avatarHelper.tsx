import { Button, Menu } from 'antd'
import { DownCircleOutlined, CheckOutlined } from '@ant-design/icons'
import { handleTextL10N, sortByStatus } from '@/components/utilsComponent/utils'
import L10N from '../../../L10N/en.json'
import AvatarElementHelper from './avartarElement'
import { CONST_TYPE_ELEMENT } from '@/constanst/constanst.const'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import _ from 'lodash'

interface inputProps {
	dataMessage: any
	showMessage: Boolean
	orderSummary: any
	handleConfirmOrder?: any
	condition: string
	dataOrigin?: any
}
interface ItemOrder {
	tableNumber: number
}
interface OrderSummary {
	[tableNumber: number]: {
		confirmedItems: number
		canceledItems: number
		totalOrderedItems: number
	}
}
const HelperMessageForUser = (props: inputProps): JSX.Element => {
	const { dataMessage, showMessage, dataOrigin, orderSummary, handleConfirmOrder, condition } =
		props
	const isAdmin = condition === 'admin'
	const isUserOrder = condition === 'userOrder'
	const isCheckUserOrderData = !isAdmin ? sortByStatus(dataMessage, 'order_inprogess') : dataMessage

	const router = useRouter()
	let sessionOrder =
		sessionStorage.getItem('location_user') !== null &&
		JSON.parse(sessionStorage.getItem('location_user'))
	const getUserOrderMessage = (isOrderSumary: boolean) => {
		return isOrderSumary !== null && !isOrderSumary
			? 'Đang chờ nhân viên xác nhận'
			: L10N['message.avatar.menuItem.text.order.confirm']
	}

	const getMessageForUser = (isOrderSumary: boolean, itemOrder: ItemOrder) => {
		return !isUserOrder
			? handleTextL10N(L10N['message.avatar.menuItem.text'], [itemOrder.tableNumber])
			: getUserOrderMessage(isOrderSumary)
	}

	const renderOrderSummary = (orderSummary: OrderSummary, itemOrder: ItemOrder) => {
		return (
			orderSummary[itemOrder.tableNumber]?.confirmedItems +
				orderSummary[itemOrder.tableNumber]?.canceledItems ===
			orderSummary[itemOrder.tableNumber]?.totalOrderedItems
		)
	}

	const renderButtonFilter = (isOrderSumary: boolean, itemOrder: ItemOrder) => {
		return isOrderSumary !== null && !isOrderSumary && !isUserOrder ? (
			<Button onClick={(event) => handleConfirmOrder(event, itemOrder)}>
				{L10N['message.avatar.menuItem.button.filter']}
			</Button>
		) : null
	}

	const rendermenuItem = (isOrderSumary: boolean) => {
		return !isUserOrder ? (
			isOrderSumary !== null && !isOrderSumary ? (
				<AvatarElementHelper
					item={L10N['message.avatar.menuItem.text.not.confirm']}
					type={CONST_TYPE_ELEMENT.ElementL10n}
					styles={{ fontSize: '12px', color: 'red', marginLeft: '10px' }}
				/>
			) : (
				<>
					<CheckOutlined style={{ fontSize: '16px', color: 'rgb(43 215 0)' }} />
					<AvatarElementHelper
						item={L10N['message.avatar.menuItem.text.confirm']}
						type={CONST_TYPE_ELEMENT.ElementL10n}
						styles={{ fontSize: '12px', color: 'green', marginLeft: '10px' }}
					/>
				</>
			)
		) : null
	}

	const renderTitleHeading = (isOrderSumary: boolean, itemOrder: ItemOrder) => {
		return (
			<div className="box-message">
				{isOrderSumary !== null && !isOrderSumary ? (
					<div className="moving-shadow-dot" />
				) : (
					<DownCircleOutlined style={{ fontSize: '16px', color: 'rgb(43 215 0)' }} />
				)}
				<a style={{ marginLeft: '5px', fontWeight: '600' }}>
					{getMessageForUser(isOrderSumary, itemOrder)}
				</a>
			</div>
		)
	}

	const renderOrderItem = (orderSummary, ele, dataMessage) => {
		if (!_.isNil(orderSummary) && ele && ele.tableNumber) {
			const isCheckExistedOrderNotConfirm =
				orderSummary[ele.tableNumber]?.confirmedItems ===
					orderSummary[ele.tableNumber]?.totalOrderedItems ||
				orderSummary[ele.tableNumber]?.confirmedItems +
					orderSummary[ele.tableNumber]?.canceledItems ===
					orderSummary[ele.tableNumber]?.totalOrderedItems

			if (!isCheckExistedOrderNotConfirm) return true // chưa xác nhận hết và chưa thanh toán
			else return false
		}
	}

	const isCheckExistedOrderNotConfirm = !isAdmin
		? renderOrderItem(orderSummary, isCheckUserOrderData[0], dataOrigin)
		: true

	return isCheckUserOrderData.length > 0 && isCheckExistedOrderNotConfirm ? (
		isCheckUserOrderData.map((ele, index) => {
			if (!isAdmin) {
				const isOrderSumary = renderOrderSummary(orderSummary, ele)
				return (
					<Menu.Item key={index} className={`${showMessage ? '' : 'show-readed-message'}`}>
						{renderTitleHeading(isOrderSumary, ele)}
						{isUserOrder ? (
							<AvatarElementHelper
								item={sessionOrder?.tableNumber}
								type={CONST_TYPE_ELEMENT.tableNumber}
							/>
						) : null}

						<AvatarElementHelper
							item={ele}
							type={CONST_TYPE_ELEMENT.Date}
							styles={{ fontSize: '13px' }}
						/>
						<AvatarElementHelper
							item={orderSummary[ele.tableNumber]?.totalOrderedItems}
							type={CONST_TYPE_ELEMENT.TotalOrder}
						/>
						<AvatarElementHelper
							item={orderSummary[ele.tableNumber]?.confirmedItems}
							type={CONST_TYPE_ELEMENT.ConfirmOrder}
						/>
						{isUserOrder ? (
							<AvatarElementHelper
								item={orderSummary[ele.tableNumber]?.canceledItems}
								type={CONST_TYPE_ELEMENT.DeletedOrder}
							/>
						) : null}

						<AvatarElementHelper
							item={ele.locationId?.nameLocation}
							type={CONST_TYPE_ELEMENT.LocationOrder}
						/>

						{renderButtonFilter(isOrderSumary, ele)}
						{rendermenuItem(isOrderSumary)}
					</Menu.Item>
				)
			} else {
				return (
					<Menu.Item key={index} className={`${showMessage ? '' : 'show-readed-message'}`}>
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
						</div>
						<p style={{ fontSize: '12px' }}>
							<b>Địa điểm: {ele.locationId?.nameLocation}</b>
						</p>
						<Link
							style={{ fontSize: '12px', color: 'blue' }}
							href={`/order/detail/${JSON.stringify(router.query)}`}
						>
							xem chi tiết
						</Link>
					</Menu.Item>
				)
			}
		})
	) : (
		<Menu.Item>{handleTextL10N(L10N['message.avatar.menuItem.nodata.text'], null)}</Menu.Item>
	)
}
export default HelperMessageForUser
