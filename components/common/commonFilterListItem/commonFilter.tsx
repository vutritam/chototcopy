import React, { useState, useEffect } from 'react'
import { Button, MenuProps, Space, Tooltip } from 'antd'
import CommonFilter from '../commonInput/commonFilter'
import { FilterOutlined, FileSearchOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons'
import Toasty from '../toasty'
import { fetchAllProduct, fetchProductByFilterCondition } from '@/redux/componentSlice/productSlice'
import { useDispatch } from 'react-redux'

interface inputProps {
	allProduct: any[] | undefined
}

const CommonFilterListItem = (props: inputProps) => {
	const { allProduct } = props
	const initItem = {
		name: 'all',
		price: 'all',
		orther: 'all',
		condition: 'And',
		comparition: '=',
		dateTime: new Date(),
	}
	const dispatch = useDispatch()
	const [itemFilterChecked, setItemFilter] = React.useState(false)
	const [showCancelTooltip, setCancelTooltip] = React.useState(false)
	const [itemFilterValueChecked, setItemFilterValueChecked] = React.useState(initItem)
	const [disableFilter, setDisableFilter] = React.useState(true)

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
	React.useEffect(() => {
		if (itemFilterChecked) {
			setCancelTooltip(true)
			setTimeout(() => {
				setCancelTooltip(false)
			}, 2000)
		}
	}, [itemFilterChecked])

	const handleFilterItem = (fieldName, value) => {
		setItemFilterValueChecked({ ...itemFilterValueChecked, [fieldName]: value })
		setDisableFilter(false)
	}

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

	const handleSelectedFilterItem = () => {
		setItemFilter(!itemFilterChecked)
	}

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
		<>
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
		</>
	)
}

export default CommonFilterListItem
