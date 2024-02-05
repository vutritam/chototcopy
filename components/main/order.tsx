import * as React from 'react'
import _ from 'lodash'
import {
	FilterOutlined,
	FileSearchOutlined,
	DeleteOutlined,
	StopOutlined,
	FireFilled,
	DownCircleOutlined,
} from '@ant-design/icons'
import { Button, Space, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import CommonFilter from '../common/commonInput/commonFilter'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProduct, fetchProductByFilterCondition } from '@/redux/componentSlice/productSlice'
import Toasty from '../common/toasty'
import { useRouter } from 'next/router'
import L10N from '../../L10N/en.json'
import NotificationTitle from '../notificationTitle/notificationTitle'
import { processRouterQuery } from '../common/parseNumber'
import ComfirmLocationOrder from '../srcConfirmLocation/confirmLocation'

export default function OrderProducts() {
	const router = useRouter()
	const initItem = {
		name: 'all',
		price: 'all',
		orther: 'all',
		condition: 'And',
		comparition: '=',
		dateTime: new Date(),
	}
	const [itemFilterChecked, setItemFilter] = React.useState(false)
	const [showCancelTooltip, setCancelTooltip] = React.useState(false)
	const [itemFilterValueChecked, setItemFilterValueChecked] = React.useState(initItem)
	const [disableFilter, setDisableFilter] = React.useState(true)
	const [allProduct, setAllProduct] = React.useState([])
	const [idTable, setIdTable] = React.useState<any>(0)
	const [show, setShow] = React.useState(false)

	const handleShow = () => {
		setShow(false)
	}

	const handleIdTableNumber = (convertedValue, getLocationOrder) => {
		if (!_.isNil(convertedValue) && getLocationOrder !== null) {
			// Kiểm tra trước khi so sánh
			if (getLocationOrder?.tableNumber === convertedValue) {
				setShow(false)
			} else {
				setShow(true)
			}
		} else if (getLocationOrder == null && !getLocationOrder?.location) {
			setShow(true)
		}
	}

	const handleCheckPathName = (convertedValue, getLocationOrder) => {
		const pathString = sessionStorage.getItem('routerAsPath')
		if (
			(!isNaN(convertedValue) && !_.isNil(convertedValue)) ||
			(!_.isNil(idTable) && !_.isNil(getLocationOrder))
		) {
			sessionStorage.setItem('routerAsPath', router.asPath)
			handleIdTableNumber(convertedValue, getLocationOrder)
		} else if (
			isNaN(convertedValue) &&
			_.isNil(convertedValue) &&
			pathString !== null &&
			!_.isNil(getLocationOrder)
		) {
			router.push(pathString)
		}
	}

	React.useEffect(() => {
		const getLocationOrder = JSON.parse(sessionStorage.getItem('location_user'))
		const convertedValue = processRouterQuery(router?.query?.order) // kiểm tra xem string có được decode ra đúng số hay ko
		handleCheckPathName(convertedValue, getLocationOrder)

		if (!_.isNil(convertedValue)) {
			setIdTable(convertedValue)
		}
	}, [router?.query?.order])

	const handleFilterItem = (fieldName, value) => {
		setItemFilterValueChecked({ ...itemFilterValueChecked, [fieldName]: value })
		setDisableFilter(false)
	}

	const itemsFilterValue0: MenuProps['items'] = [
		{
			key: '1',
			value: 'or',
			label: <p value={1}>Or</p>,
		},
		{
			key: '2',
			value: 'And',
			label: <p value={2}>And</p>,
		},
		{
			key: '3',
			value: 'Not',
			label: <p value={3}>Not</p>,
		},
	]

	const itemsFilterValue: MenuProps['items'] = [
		{
			key: '1',
			value: '>',
			label: <p value={'greaterThan'}>{'>'}</p>,
		},
		{
			key: '2',
			value: '<',
			label: <p value={'lessThan'}>{'<'}</p>,
		},
		{
			key: '3',
			value: '=',
			label: <p value={'Equal'}>=</p>,
		},
	]

	const itemsFilterValue1: MenuProps['items'] = [
		{
			key: '1',
			value: 'nước mía',
			label: <p value={1}>Nước mía</p>,
		},
		{
			key: '2',
			value: 'cà phê ',
			label: <p value={2}>Cafe</p>,
		},
		{
			key: '3',
			value: 'Đồ ăn vặt',
			label: <p value={3}>Đồ ăn vặt</p>,
		},
		{
			key: '4',
			value: 'nước cam',
			label: <p value={4}>Nước cam</p>,
		},
		{
			key: '5',
			value: 'all',
			label: <p value={5}>Tất cả</p>,
		},
	]
	const itemsFilterValue2: MenuProps['items'] = [
		{
			key: '1',
			value: '100000',
			label: <p value={1}>100000</p>,
		},
		{
			key: '2',
			value: '200000',
			label: <p value={2}>200000</p>,
		},
		{
			key: '3',
			value: '300000',
			label: <p value={3}>300000</p>,
		},

		{
			key: '4',
			value: 'all',
			label: <p value={4}>Tất cả</p>,
		},
	]

	const itemsFilterValue3: MenuProps['items'] = [
		{
			key: '1',
			value: 'Banh',
			label: <p value={1}>Bánh</p>,
		},
		{
			key: '2',
			value: 'Keo',
			label: <p value={2}>Kẹo</p>,
		},
		{
			key: '3',
			value: 'Banhtrangtron',
			label: <p value={2}>Bánh tráng trộn</p>,
		},
		{
			key: '4',
			value: 'all',
			label: <p value={4}>Tất cả</p>,
		},
	]

	const renderItemSelected = (itemsFilter, state, fieldName) => {
		return (
			<div style={{ width: '100%' }}>
				<CommonFilter
					fieldName={fieldName}
					items={itemsFilter}
					state={state}
					handleLocationChange={handleFilterItem}
				/>
			</div>
		)
	}

	React.useEffect(() => {
		if (itemFilterChecked) {
			setCancelTooltip(true)
			setTimeout(() => {
				setCancelTooltip(false)
			}, 2000)
		}
	}, [itemFilterChecked])

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

	React.useEffect(() => {
		const fetchData = async () => {
			const { payload } = await dispatch(fetchAllProduct())
			if (payload?.success) {
				setAllProduct(payload.data)
			}
		}
		fetchData()
	}, [])

	const handleSelectedFilterItem = () => {
		setItemFilter(!itemFilterChecked)
	}

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

	const handleSubmit = async () => {
		const { payload } = await dispatch(fetchProductByFilterCondition(itemFilterValueChecked))
		if (!payload?.success) {
			Toasty.error('Network and proplem when call data from server')
		}
	}
	const handleClearFilter = async () => {
		const { payload } = await dispatch(fetchAllProduct())
		if (!payload?.success) {
			Toasty.error('Network and proplem when call data from server')
		}

		setItemFilterValueChecked(initItem)
		setDisableFilter(true)
	}

	return (
		<div>
			{renderNotiItemOrder()}
			<ComfirmLocationOrder
				label="Xác nhận nơi đặt"
				tittle="Xác nhận nơi đặt"
				open={show}
				handleShow={handleShow}
				idTable={idTable}
			/>
			<div
				className="catelories"
				style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}
			>
				<Space direction="vertical">
					{itemFilterChecked ? (
						<Tooltip title="Hủy bỏ tìm kiếm" color={'red'} key={'red'} open={showCancelTooltip}>
							<StopOutlined
								style={{ fontSize: '20px', display: 'flex', color: 'red' }}
								onClick={(e) => handleSelectedFilterItem(!itemFilterChecked)}
							/>
						</Tooltip>
					) : (
						<FilterOutlined
							style={{ fontSize: '20px', display: 'flex' }}
							onClick={(e) => handleSelectedFilterItem(!itemFilterChecked)}
						/>
					)}
				</Space>
				<Space wrap>
					<div style={{ width: '220px' }}>
						<b style={{ fontSize: '17px' }}>Danh mục sản phẩm ({allProduct.length})</b>
					</div>
				</Space>
			</div>
			<Space className="filter-mobile">
				{itemFilterChecked ? (
					<>
						<h5>Lọc theo</h5>
						{renderItemSelected(itemsFilterValue1, itemFilterValueChecked.name, 'name')}
						{renderItemSelected(itemsFilterValue0, itemFilterValueChecked.condition, 'condition')}
						{renderItemSelected(itemsFilterValue3, itemFilterValueChecked.orther, 'orther')}
						{renderItemSelected(
							itemsFilterValue,
							itemFilterValueChecked.comparition,
							'comparition'
						)}

						{renderItemSelected(itemsFilterValue2, itemFilterValueChecked.price, 'price')}
					</>
				) : null}
				{itemFilterChecked && (
					<Space>
						<Button type="primary" icon={<FileSearchOutlined />} onClick={() => handleSubmit()}>
							Tìm kiếm
						</Button>
						<Tooltip
							title="Xóa bộ lọc"
							color={'red'}
							key={'red'}
							placement="right"
							open={showCancelTooltip}
						>
							<Button
								type="default"
								style={{ color: disableFilter ? '' : 'green' }}
								icon={<DeleteOutlined />}
								disabled={disableFilter}
								onClick={() => handleClearFilter()}
							></Button>
						</Tooltip>
					</Space>
				)}
			</Space>
		</div>
	)
}
