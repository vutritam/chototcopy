// employee.tsx
import React, { useEffect, useState } from 'react'
import { Button, Image, Tooltip } from 'antd'
import { EditOutlined, RollbackOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { fetchProductById } from '@/redux/componentSlice/productSlice'
// import { useSearchParams } from 'next/navigation'

// export const getServerSideProps = async (context) => {
// 	// Xử lý logic để lấy dữ liệu chi tiết sản phẩm dựa trên context.params.detail
// 	const { detail } = context.query
// 	console.log(detail, 'ádasdsa')

// 	// Trả về dữ liệu làm props cho component
// 	return {
// 		props: {
// 			detailData: detail,
// 		},
// 	}
// }

const ProductDetail: React.FC = () => {
	const router = useRouter()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const [loading, setLoading] = React.useState<Boolean>(false)
	const [data, setDataList] = React.useState<Object>({})
	const { detail } = router.query
	useEffect(() => {
		if (detail) {
			;(async () => {
				const { payload } = await dispatch(fetchProductById(detail))
				setLoading(true)
				if (payload?.success) {
					setLoading(false)
					setDataList(payload?.data)
				}
			})()
		}
	}, [detail])

	// const searchParams = useSearchParams()
	// const detailParam = router.query.detail

	const handleGoBack = () => {
		router.back()
	}
	const handleGetProduct = () => {
		console.log('get product')
	}
	return (
		<>
			{/* <p>Queries: {JSON.stringify(router.query)}</p> */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
				<div>
					<Tooltip placement="left" title={'quay lại'}>
						<RollbackOutlined
							style={{ color: 'blue', fontSize: '17px', cursor: 'pointer' }}
							onClick={handleGoBack}
						/>
					</Tooltip>
				</div>
				<h4 style={{ margin: '0' }}>Chi tiết sản phẩm</h4>
			</div>
			<div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
				<Image
					width={200}
					height={200}
					style={{ objectFit: 'contain' }}
					src={process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/${data.file}`}
				/>
				<div>
					<h2 style={{ color: 'blue' }}>{data.name}</h2>
					<div>
						<span>
							<b>Ngày tạo</b>: {data.StartDate}
						</span>
						<span>
							<div style={{ display: 'flex', gap: '10px' }}>
								<b>giá: </b>
								<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
									<div className="online-active-employee " style={{ width: '10px' }}></div>
									<span>{data.price}</span>
								</div>
							</div>
						</span>
						<span>
							<div style={{ display: 'flex', gap: '10px' }}>
								<b>số lượng </b>
								<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
									{data.quantity}
								</div>
							</div>
						</span>

						<span>
							<div style={{ display: 'flex', gap: '10px' }}>
								<b>Trạng thái: </b>
								<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
									{data.quantity > 0 ? 'còn hàng' : 'hết hàng'}
								</div>
							</div>
						</span>
						<span>
							<div style={{ display: 'flex', gap: '10px' }}>
								<b>Mô tả: </b>
								<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
									{data.Description}
								</div>
							</div>
						</span>
						<div style={{ marginTop: '10px' }}>
							<span>
								{' '}
								<Button icon={<EditOutlined />} onClick={() => handleGetProduct()}>
									Yêu cầu nhập hàng
								</Button>
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ProductDetail
