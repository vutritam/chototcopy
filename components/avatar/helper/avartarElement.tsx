import moment from 'moment'
import React from 'react'
import { CONST_TYPE_ELEMENT } from '@/constanst/constanst.const'
import L10N from '../../../L10N/en.json'

interface inputProps {
	item?: any
	type: string
	styles?: any
}

const AvatarElementHelper = (props: inputProps): JSX.Element => {
	const { item, type, styles } = props
	const handleRenderElement = (type: string) => {
		switch (type) {
			case CONST_TYPE_ELEMENT.Date:
				const spanElementDate = React.createElement(
					'span',
					{ style: styles },
					L10N['message.avatar.menuItem.element.date.title']
				)
				const formattedDate = moment(item.dateTime).format('YYYY-MM-DD HH:mm:ss')
				const spanElementTitle = React.createElement('span', null, formattedDate)
				return React.createElement('div', { style: styles }, spanElementDate, spanElementTitle)
			case CONST_TYPE_ELEMENT.TotalOrder:
				const spanElementToTalOrder = React.createElement(
					'span',
					{ style: { fontWeight: 'bold', color: 'blue' } },
					null,
					item
				)
				const spanElementTitleToTal = React.createElement(
					'span',
					null,
					L10N['message.avatar.menuItem.element.totalOrder.title']
				)
				return React.createElement(
					'div',
					{ style: { fontSize: '14px' } },
					spanElementTitleToTal,
					spanElementToTalOrder
				)
			case CONST_TYPE_ELEMENT.ConfirmOrder:
				const spanElementConfirmOrder = React.createElement(
					'span',
					{ style: { fontWeight: 'bold', color: 'blue' } },
					null,
					item
				)
				const spanElementConfirmTitle = React.createElement(
					'span',
					null,
					L10N['message.avatar.menuItem.element.confirmOrder.title']
				)
				return React.createElement(
					'div',
					{ style: { fontSize: '14px' } },
					spanElementConfirmTitle,
					spanElementConfirmOrder
				)
			case CONST_TYPE_ELEMENT.DeletedOrder:
				const spanElementDeletedOrderTitle = React.createElement(
					'span',
					null,
					L10N['message.avatar.menuItem.element.deleteOrder.title']
				)
				const spanElementDeletedOrder = React.createElement(
					'span',
					{ style: { fontWeight: 'bold', color: 'blue' } },
					null,
					item
				)
				return React.createElement(
					'div',
					{ style: { fontSize: '14px' } },
					spanElementDeletedOrderTitle,
					spanElementDeletedOrder
				)
			case CONST_TYPE_ELEMENT.LocationOrder:
				const bElementConfirmOrder = React.createElement(
					'b',
					null,
					L10N['message.avatar.menuItem.element.locationOrder.title'],
					item
				)

				return React.createElement('div', { style: { fontSize: '14px' } }, bElementConfirmOrder)
			case CONST_TYPE_ELEMENT.ElementL10n:
				return React.createElement('span', { style: styles }, null, item)

			default:
				break
		}
	}
	return handleRenderElement(type)
}

export default AvatarElementHelper
