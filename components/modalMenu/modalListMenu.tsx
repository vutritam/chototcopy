import React, { useEffect, useState } from 'react'
import {
	Avatar,
	Button,
	Checkbox,
	Image,
	Input,
	List,
	Modal,
	Row,
	Col,
	Space,
	InputNumber,
} from 'antd'
import { getListProduct } from '../utilsComponent/utils'
import { DeleteOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import VirtualList from 'rc-virtual-list'
import { fetchAllProductPaginated } from '@/redux/componentSlice/productSlice'
import type { CheckboxProps } from 'antd'
import { io } from 'socket.io-client'
import { forEach } from 'lodash'
import Toasty from '../common/toasty'
import useSocket from '../common/socketConfig/socketClient'

const ModalListMenu: React.FC = ({ show, handleShow }) => {
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const [loadingBtn, setLoadingBtn] = useState(false)
	const [dataList, setDataList] = useState([])
	const [dataAllList, setDataAllList] = useState([])
	const [checkedListId, setCheckedListId] = useState([])
	const [countNumber, setCountNumber] = useState(1)
	const [value, setValue] = useState<string[] | number[] | null>([])
	const ENV_HOST = process.env.NEXT_PUBLIC_HOST
	const socket = useSocket(ENV_HOST)

	let sessionOrder =
		sessionStorage.getItem('location_user') !== null &&
		JSON.parse(sessionStorage.getItem('location_user'))
	useEffect(() => {
		;(async () => {
			await getListProduct(dispatch, setLoading, setDataAllList)
		})()
	}, [dispatch, setLoading, setDataAllList])

	const appendData = async (countNumber) => {
		if (loading) return // Tránh gọi nếu đang trong quá trình loading

		setLoading(true)

		try {
			const { payload } = await dispatch(
				fetchAllProductPaginated({ pageNumber: countNumber, limitCount: 3 })
			)

			if (payload?.success) {
				const uniqueSet = new Set([...dataList, ...payload?.data])
				setDataList([...uniqueSet])
			}
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		try {
			appendData(countNumber)
		} catch (error) {
			console.error('Error in appendData:', error)
		}
	}, [countNumber])

	const ContainerHeight = 148 * 3
	const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
		const isNearBottom =
			Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1

		const hasNextPage = dataAllList && countNumber <= Math.ceil(dataAllList.length / 3)

		if (isNearBottom && hasNextPage) {
			setCountNumber(countNumber + 1)
		}
	}

	const onChange: CheckboxProps['onChange'] = (e, item) => {
		let cloneItem = [...checkedListId]
		if (e?.target?.checked && !cloneItem.includes(e?.target?.value)) {
			setCheckedListId([...checkedListId, e.target.value])
		} else {
			const itemChecked = cloneItem.filter((item) => item !== e?.target?.value)
			setCheckedListId(itemChecked)
		}
	}

	const handleSubmit = async () => {
		setLoadingBtn(true)
		const checkValiDataSubmit = value && value?.length > 0
		const checkValiDataQuantity = value && value?.length !== checkedListId?.length

		if (!checkValiDataSubmit || checkValiDataQuantity) {
			setLoadingBtn(false)
			Toasty.error('Bạn chưa chọn số lượng')
			return
		}
		if (socket && checkedListId.length > 0) {
			let obj = {
				tableNumber: sessionOrder?.tableNumber,
				productId: checkedListId,
				locationId: sessionOrder?.locationId,
				quantity: value,
				description: '',
				status: 'order_inprogess',
			}
			// Gửi sự kiện tới Socket.IO server
			socket.emit('muptipleOrder', obj)
			socket.emit('getProductOrder', {
				message: 'Gửi sự kiện lấy sản phẩm',
				locationId: sessionOrder?.location?._id,
			})
			setLoadingBtn(false)
		} else {
			Toasty.error('Vui lòng điền đầy đủ')
		}
	}

	const onChangeValue = (e, item) => {
		const shouldAdd = !value.some((element) => element.id === item._id)

		// Nếu shouldAdd là true, thêm phần tử vào mảng
		if (shouldAdd) {
			setValue([...value, { id: item._id, quantity: e }])
		} else {
			const cloneItem = [...value]
			const findIndex = cloneItem?.findIndex((e) => e.id === item._id)
			if (findIndex !== -1) {
				cloneItem[findIndex].quantity = e
			}
			setValue(cloneItem)
		}
	}

	// const handleResetValue = (item) => {
	// 	const cloneItem = [...value]
	// 	const shouldAdd = cloneItem.findIndex((element) => element.id === item._id)
	// 	if (shouldAdd !== -1) {
	// 		cloneItem[shouldAdd].quantity = 1
	// 		setValue(cloneItem)
	// 	}
	// }

	return (
		<>
			<Modal
				title="Danh sách sản phẩm"
				open={show}
				onOk={handleShow}
				onCancel={handleShow}
				okButtonProps={{ disabled: true }}
				cancelButtonProps={{ disabled: true }}
				footer={
					<>
						<Button onClick={handleSubmit} loading={loadingBtn}>
							Đặt tất cả
						</Button>
						<Button>Hủy</Button>
					</>
				}
			>
				<List loading={loading}>
					<VirtualList
						data={dataList}
						height={ContainerHeight}
						itemHeight={47}
						itemKey="email"
						onScroll={onScroll}
					>
						{(item) => (
							<List.Item key={item.id}>
								<List.Item.Meta
									style={{ margin: 10 }}
									avatar={
										<Image
											width={50}
											height={50}
											style={{ borderRadius: '50px', objectFit: 'cover' }}
											alt="logo"
											src={process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/${item.file}`}
										/>
									}
									title={item.name}
									description={
										<>
											<span>
												Giá:
												<span style={{ color: 'blue', marginLeft: '10px' }}>
													<span className="">{item.price}</span>
												</span>
											</span>
											<div className="flex-box">
												<span>
													Số lượng:{' '}
													{item.quantity > 0 ? (
														item.quantity
													) : (
														<span style={{ color: 'red' }}>Đã hết hàng</span>
													)}
												</span>
												<span>
													<Space>
														<InputNumber
															status={
																checkedListId?.find((e) => e === item._id) &&
																!value?.find((ele) => ele.id === item._id)
																	? 'error'
																	: ''
															}
															min={1}
															defaultValue={1}
															key={value?.find((element) => element.id === item._id)?.quantity}
															value={value?.find((element) => element.id === item._id)?.quantity}
															onChange={(e) => onChangeValue(e, item)}
															disabled={item.quantity <= 0}
														/>

														<Checkbox
															disabled={item.quantity <= 0}
															value={item._id}
															onChange={(e) => onChange(e, item)}
														>
															Chọn
														</Checkbox>
													</Space>
												</span>
											</div>
										</>
									}
								/>

								{item.Description}
							</List.Item>
						)}
					</VirtualList>
				</List>
			</Modal>
		</>
	)
}

export default ModalListMenu
