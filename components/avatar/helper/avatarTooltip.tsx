import { Badge, Button, Dropdown, Menu, Space, Tooltip } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { handleTextL10N, sortByStatus } from '@/components/helper/helper'
import L10N from '../../L10N/en.json'
import HelperMessageForUser from './avatarHelper'
import { useEffect, useState } from 'react'
import _ from 'lodash'
interface inputProps {
	dataMessage: any
	showMessage: boolean
	countMessage: number
	orderSummary: any
	handleUpdateSeenMessage: any
	condition: string
	elementBellOrder: any
	handleConfirmOrder: any
}

const HelperMessageToolTip = (props: inputProps): JSX.Element => {
	const {
		dataMessage,
		showMessage,
		countMessage,
		orderSummary,
		handleUpdateSeenMessage,
		condition,
		elementBellOrder,
		handleConfirmOrder,
	} = props
	const isDataMessage = dataMessage && dataMessage
	const isUserOrder = condition === 'userOrder'

	const [data, setData] = useState<array>([])
	useEffect(() => {
		const sortItemByTableNumber = isDataMessage.reduce((acc, order) => {
			const { tableNumber, quantity } = order
			const existingOrder = acc.find((group) => group.tableNumber === tableNumber)

			if (existingOrder) {
				existingOrder.quantity += quantity
			} else {
				acc.push({ ...order })
			}

			return acc
		}, [])
		setData(sortItemByTableNumber)
	}, [dataMessage.length])

	return (
		<Dropdown
			dropdownRender={(menu) => (
				<Menu className="showScroll">
					<Menu.Item>
						<h5>{handleTextL10N(L10N['message.avatar.menuItem.item.title'], [data.length])}</h5>
					</Menu.Item>
					<HelperMessageForUser
						dataMessage={data}
						showMessage={showMessage}
						handleConfirmOrder={!isUserOrder ? handleConfirmOrder : null}
						orderSummary={orderSummary}
						condition={condition}
					/>
				</Menu>
			)}
			trigger={['click']}
			onClick={() => handleUpdateSeenMessage(true)}
		>
			<a onClick={(e) => e.preventDefault()}>
				<Space size="large">
					{isDataMessage?.length > 0 ? (
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
}
export default HelperMessageToolTip
