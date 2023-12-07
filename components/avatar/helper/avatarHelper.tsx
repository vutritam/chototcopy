import { Button, Menu } from 'antd'
import { DownCircleOutlined } from '@ant-design/icons'
import { handleTextL10N, sortByStatus } from '@/components/helper/helper'
import moment from 'moment'
import L10N from '../../L10N/en.json'
interface inputProps {
	dataMessage: any
	showMessage: Boolean
	orderSummary: any
	handleConfirmOrder?: any
	condition: string
}

const HelperMessageForUser = (props: inputProps): JSX.Element => {
	const { dataMessage, showMessage, orderSummary, handleConfirmOrder, condition } = props
	const isCheckUserOrderData =
		condition === 'userOrder' ? sortByStatus(dataMessage?.data, 'order_pending') : dataMessage
	const isUserOrder = condition === 'userOrder'
	console.log(isCheckUserOrderData, 'isCheckUserOrderData')

	return isCheckUserOrderData.length > 0 ? (
		isCheckUserOrderData.map((ele, index) => {
			const isOrderSumary =
				orderSummary[ele.tableNumber]?.totalOrderedItems !==
				orderSummary[ele.tableNumber]?.confirmedItems
			return (
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
							{ele.status === 'order_pending'
								? !isUserOrder
									? handleTextL10N(L10N['message.avatar.menuItem.text'], [ele.tableNumber])
									: ele.message
								: !isUserOrder
								? L10N['message.avatar.menuItem.text.employee.confirm']
								: L10N['message.avatar.menuItem.text.order.confirm']}
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
					{isOrderSumary && !isUserOrder ? (
						<Button onClick={(event) => handleConfirmOrder(event, ele)}>
							{L10N['message.avatar.menuItem.button.filter']}
						</Button>
					) : null}

					{!isUserOrder ? (
						ele.status !== 'order_success' && isOrderSumary ? (
							<span style={{ fontSize: '12px', color: 'red', marginLeft: '10px' }}>
								{L10N['message.avatar.menuItem.text.not.confirm']}
							</span>
						) : (
							<span style={{ fontSize: '12px', color: 'green', marginLeft: '10px' }}>
								{L10N['message.avatar.menuItem.text.confirm']}
							</span>
						)
					) : null}
				</Menu.Item>
			)
		})
	) : (
		<Menu.Item>{handleTextL10N(L10N['message.avatar.menuItem.nodata.text'], null)}</Menu.Item>
	)
}
export default HelperMessageForUser
