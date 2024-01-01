import { Button, Menu } from 'antd'
import { DownCircleOutlined, CheckOutlined } from '@ant-design/icons'
import { handleTextL10N, sortByStatus } from '@/components/helper/helper'
import L10N from '../../L10N/en.json'
import AvatarElementHelper from './avartarElement'
import { CONST_TYPE_ELEMENT } from '@/constanst/constanst.const'
interface inputProps {
	dataMessage: any
	showMessage: Boolean
	orderSummary: any
	handleConfirmOrder?: any
	condition: string
}

const HelperMessageForUser = (props: inputProps): JSX.Element => {
	const { dataMessage, showMessage, orderSummary, handleConfirmOrder, condition } = props
	const isCheckUserOrderData = sortByStatus(dataMessage, 'order_inprogess')
	const isUserOrder = condition === 'userOrder'

	const getUserOrderMessage = (isOrderSumary: boolean) => {
		return !isOrderSumary
			? 'Đang chờ nhân viên xác nhận'
			: L10N['message.avatar.menuItem.text.order.confirm']
	}

	const getMessageForUser = (isOrderSumary: boolean, itemOrder) => {
		return !isUserOrder
			? handleTextL10N(L10N['message.avatar.menuItem.text'], [itemOrder.tableNumber])
			: getUserOrderMessage(isOrderSumary)
	}

	const renderOrderSummary = (orderSummary, itemOrder) => {
		return (
			orderSummary[itemOrder.tableNumber]?.confirmedItems +
				orderSummary[itemOrder.tableNumber]?.canceledItems ===
			orderSummary[itemOrder.tableNumber]?.totalOrderedItems
		)
	}
	const renderButtonFilter = (isOrderSumary: boolean, itemOrder) => {
		return !isOrderSumary && !isUserOrder ? (
			<Button onClick={(event) => handleConfirmOrder(event, itemOrder)}>
				{L10N['message.avatar.menuItem.button.filter']}
			</Button>
		) : null
	}
	const rendermenuItem = (isOrderSumary: boolean) => {
		return !isUserOrder ? (
			!isOrderSumary ? (
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

	const renderTitleHeading = (isOrderSumary: boolean, itemOrder) => {
		return (
			<div className="box-message">
				{!isOrderSumary ? (
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

	return isCheckUserOrderData.length > 0 ? (
		isCheckUserOrderData.map((ele, index) => {
			const isOrderSumary = renderOrderSummary(orderSummary, ele)
			return (
				<Menu.Item key={index} className={`${showMessage ? '' : 'show-readed-message'}`}>
					{renderTitleHeading(isOrderSumary, ele)}
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

					<AvatarElementHelper item={ele.location} type={CONST_TYPE_ELEMENT.LocationOrder} />

					{renderButtonFilter(isOrderSumary, ele)}
					{rendermenuItem(isOrderSumary)}
				</Menu.Item>
			)
		})
	) : (
		<Menu.Item>{handleTextL10N(L10N['message.avatar.menuItem.nodata.text'], null)}</Menu.Item>
	)
}
export default HelperMessageForUser
