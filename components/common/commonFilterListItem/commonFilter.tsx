import React, { useState, useEffect } from 'react'
import { Button, Menu, MenuProps, Space, Tooltip } from 'antd'
import CommonFilter from '../commonInput/commonFilter'
import { FilterOutlined, FileSearchOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons'
import Toasty from '../toasty'
import { fetchAllProduct, fetchProductByFilterCondition } from '@/redux/componentSlice/productSlice'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { ThunkDispatch } from '@reduxjs/toolkit'

interface inputProps {
	allProduct: any[] | undefined
}
interface MenuItem {
	key: string
	value: any
	label: React.ReactNode
	// Các thuộc tính khác nếu có
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
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const [itemFilterChecked, setItemFilter] = React.useState(false)
	const [showCancelTooltip, setCancelTooltip] = React.useState(false)
	const [itemFilterValueChecked, setItemFilterValueChecked] = React.useState(initItem)
	const [disableFilter, setDisableFilter] = React.useState(true)

	const itemsFilterValue0: any = [
		{
			key: '1',
			value: 'or',
			label: <div>Or</div>,
		},
		{
			key: '2',
			value: 'And',
			label: <div>And</div>,
		},
		{
			key: '3',
			value: 'Not',
			label: <div>Not</div>,
		},
	]

	const itemsFilterValue: any = [
		{
			key: '1',
			value: 'greaterThan',
			label: <div>{'>'}</div>,
		},
		{
			key: '2',
			value: 'lessThan',
			label: <div>{'<'}</div>,
		},
		{
			key: '3',
			value: 'Equal',
			label: <div>=</div>,
		},
	]

	const itemsFilterValue1: any = [
		{
			key: '1',
			value: '1',
			label: <p>Nước mía</p>,
		},
		{
			key: '2',
			value: '2',
			label: <p>Cafe</p>,
		},
		{
			key: '3',
			value: '3',
			label: <p>Đồ ăn vặt</p>,
		},
		{
			key: '4',
			value: '4',
			label: <p>Nước cam</p>,
		},
		{
			key: '5',
			value: 'all',
			label: <p>Tất cả</p>,
		},
	]
	const itemsFilterValue2: any = [
		{
			key: '1',
			value: '100000',
			label: <p>100000</p>,
		},
		{
			key: '2',
			value: '200000',
			label: <p>200000</p>,
		},
		{
			key: '3',
			value: '300000',
			label: <p>300000</p>,
		},

		{
			key: '4',
			value: 'all',
			label: <p>Tất cả</p>,
		},
	]

	const itemsFilterValue3: any = [
		{
			key: '1',
			value: 'Banh',
			label: <p>Bánh</p>,
		},
		{
			key: '2',
			value: 'Keo',
			label: <p>Kẹo</p>,
		},
		{
			key: '3',
			value: 'Banhtrangtron',
			label: <p>Bánh tráng trộn</p>,
		},
		{
			key: '4',
			value: 'all',
			label: <p>Tất cả</p>,
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

	const handleFilterItem = (fieldName: string, value: any) => {
		setItemFilterValueChecked({ ...itemFilterValueChecked, [fieldName]: value })
		setDisableFilter(false)
	}

	const renderItemSelected = (itemsFilter: any, state: any, fieldName: string) => {
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

	const handleSelectedFilterItem = (itemFilterChecked: any) => {
		setItemFilter(itemFilterChecked)
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
			<div className="catelories" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
						<b style={{ fontSize: '17px' }}>Danh mục sản phẩm ({allProduct?.length || []})</b>
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
