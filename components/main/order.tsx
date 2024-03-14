import * as React from 'react'
import _ from 'lodash'
import { DownCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProduct } from '@/redux/componentSlice/productSlice'
import { useRouter } from 'next/router'
import L10N from '../../L10N/en.json'
import NotificationTitle from '../notificationTitle/notificationTitle'
import { processRouterQuery } from '../common/parseNumber'
import ComfirmLocationOrder from '../confirmLocation/confirmLocation'
import CommonFilterListItem from '../common/commonFilterListItem/commonFilter'
import ModalListMenu from '../modalMenu/modalListMenu'

export default function OrderProducts() {
	const router = useRouter()
	const dispatch = useDispatch()
	const isOrderPage = router.pathname.startsWith('/order')
	const [dataTotalOrderAndConfirm, setDataTotalOrderAndConfirm] = React.useState({
		totalOrderedItems: 0,
		confirmedItems: 0,
		canceledItems: 0,
	})

	//message redux store
	const dataOrderByNumberTable = useSelector(
		(state: any) => state.dataOrder?.dataOrderByNumberTable?.data
	)
	const [allProduct, setAllProduct] = React.useState([])
	// const [idTable, setIdTable] = React.useState<any>(0)
	const [showListMenu, setShowListMenu] = React.useState(false)

	const handleShow = () => {
		setShowListMenu(!showListMenu)
	}

	// const handleIdTableNumber = (convertedValue, getLocationOrder) => {
	// 	if (!_.isNil(convertedValue) && getLocationOrder !== null) {
	// 		// Kiểm tra trước khi so sánh
	// 		if (getLocationOrder?.tableNumber === convertedValue) {
	// 			setShow(false)
	// 			setShowListMenu(true)
	// 		} else {
	// 			setShow(true)
	// 			setShowListMenu(false)
	// 		}
	// 	} else if (getLocationOrder == null && !getLocationOrder?.location) {
	// 		setShow(true)
	// 		setShowListMenu(false)
	// 	}
	// }

	// const handleCheckPathName = (convertedValue, getLocationOrder) => {
	// 	const pathString = sessionStorage.getItem('routerAsPath')
	// 	if (
	// 		(!isNaN(convertedValue) && !_.isNil(convertedValue)) ||
	// 		(!_.isNil(idTable) && !_.isNil(getLocationOrder))
	// 	) {
	// 		sessionStorage.setItem('routerAsPath', router.asPath)
	// 		setShowListMenu(true)
	// 		// handleIdTableNumber(convertedValue, getLocationOrder)
	// 	} else if (
	// 		isNaN(convertedValue) &&
	// 		_.isNil(convertedValue) &&
	// 		pathString !== null &&
	// 		!_.isNil(getLocationOrder)
	// 	) {
	// 		router.push(pathString)
	// 	}
	// }

	React.useEffect(() => {
		// const getLocationOrder = JSON.parse(sessionStorage.getItem('location_user'))
		const convertedValue = processRouterQuery(router?.query?.order) // kiểm tra xem string có được decode ra đúng số hay ko

		// handleCheckPathName(convertedValue, getLocationOrder)

		if (!_.isNil(convertedValue)) {
			sessionStorage.setItem(
				'location_user',
				JSON.stringify({
					tableNumber: convertedValue?.tableNumber,
					locationId: convertedValue.locationId,
				})
			)
			setShowListMenu(true)
			// setIdTable(convertedValue)
		}
	}, [router?.query?.order])

	const renderNotiItemOrder = () => {
		const messageTitle = 'Thông báo quan trọng'
		const caculatorItem =
			Number(dataTotalOrderAndConfirm.totalOrderedItems) -
			Number(dataTotalOrderAndConfirm.confirmedItems)
		const totalData =
			dataTotalOrderAndConfirm.confirmedItems + dataTotalOrderAndConfirm.canceledItems !==
			dataTotalOrderAndConfirm.totalOrderedItems
		const contents = `Bạn có ${dataTotalOrderAndConfirm.confirmedItems} món đã xác nhận và ${caculatorItem} món chưa xác nhận. Vui lòng chờ đến khi nhân viên xác nhận!`
		const atLeastOneValueGreaterThanZero =
			dataTotalOrderAndConfirm.totalOrderedItems > 0 ||
			dataTotalOrderAndConfirm.confirmedItems > 0 ||
			dataTotalOrderAndConfirm.canceledItems > 0
		return isOrderPage && allProduct.length > 0 && totalData ? (
			<NotificationTitle message={messageTitle} description={contents} />
		) : isOrderPage && allProduct.length > 0 && atLeastOneValueGreaterThanZero ? (
			<>
				<NotificationTitle
					message={messageTitle}
					description={
						<div>
							<DownCircleOutlined />{' '}
							<span style={{ fontSize: '16px', color: 'green' }}>
								{L10N['message.product.orderConfirm.marquee.content']}
							</span>{' '}
							(
							<span style={{ color: 'red' }}>
								{L10N['message.product.orderConfirm.marquee.content.warning']}
							</span>
							)
						</div>
					}
				/>
			</>
		) : null
	}

	// const onSetLocationData = async () => {

	// 	await dispatch(
	// 		fetchAllOrderByNumberTableAndLocationUser({
	// 			tableNumber: props.idTable,
	// 			locationId: dataInput.locationId,
	// 		})
	// 	)
	// 	// window.location.reload()
	// }
	React.useEffect(() => {
		const fetchData = async () => {
			const { payload } = await dispatch(fetchAllProduct())
			if (payload?.success) {
				setAllProduct(payload.data)
			}
		}
		fetchData()
	}, [])

	// React.useEffect(() => {
	// 	if (show) {
	// 		setShowListMenu(false)
	// 	} else {
	// 		setShowListMenu(true)
	// 	}
	// }, [show])

	React.useEffect(() => {
		let sessionOrder = sessionStorage.getItem('warning_text_order')
		try {
			sessionOrder = JSON.parse(sessionOrder)

			if (sessionOrder !== null) {
				setDataTotalOrderAndConfirm({
					totalOrderedItems: sessionOrder.totalOrderedItems,
					confirmedItems: sessionOrder.confirmedItems,
					canceledItems: sessionOrder.canceledItems,
				})
			} else {
				console.error('sessionOrder is null.')
			}
		} catch (error) {
			console.error('Error parsing JSON:', error)
		}
	}, [JSON.stringify(dataOrderByNumberTable)])

	return (
		<div>
			{renderNotiItemOrder()}
			{/* <ComfirmLocationOrder
				label="Xác nhận nơi đặt"
				tittle="Xác nhận nơi đặt"
				open={show}
				handleShow={handleShow}
				idTable={idTable}
			/> */}
			<ModalListMenu show={showListMenu} handleShow={handleShow} />
			<CommonFilterListItem allProduct={allProduct} />
		</div>
	)
}
