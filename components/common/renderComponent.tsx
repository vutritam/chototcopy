import React, { useState, useEffect } from 'react'
import { Space, Spin } from 'antd'
import { useRouter } from 'next/router'
import ListItem from '@/components/main/listItem'
import ManageWork from '@/components/main/manageWork'
import Products from '@/components/main/products'
import DetailOrder from '../main/detailOrder'

const RenderedComponent: React.FC = () => {
	const router = useRouter()
	const isAdminPage = router.pathname.startsWith('/admin')
	const isEmployeePage = router.pathname.startsWith('/employee')
	// const isOrderPage = router.pathname.startsWith('/order')

	const handleBeginRoute = () => {
		if (isAdminPage) {
			return renderAdminContent(router.pathname)
		} else if (isEmployeePage) {
			return renderEmployeeContent(router.pathname)
		} else {
			return renderOrderContent(router.pathname)
		}
	}

	useEffect(() => {
		handleBeginRoute()
	}, [])

	const renderEmployeeContent = (router: string) => {
		switch (router) {
			case '/employee/[employee]':
				return <div>employee with {JSON.stringify(router)}</div>
			// Xử lý cho các component khác tùy theo số lượng và tên của chúng
			default:
				return <ListItem />
		}
	}

	const renderOrderContent = (router: string) => {
		switch (router) {
			case '/order/[order]':
				return <Products />
			case '/order/detail/[orderDetail]':
				return <DetailOrder />
			// Xử lý cho các component khác tùy theo số lượng và tên của chúng
			// default:
			// return <ListItem />
		}
	}

	const renderAdminContent = (router: string) => {
		switch (router) {
			case '/admin/listItem':
				return <ListItem />

			case '/admin/manage-work':
				return <ManageWork />

			case '/admin/products':
				return <Products />

			// Xử lý cho các component khác tùy theo số lượng và tên của chúng
			default:
				return <ListItem />
		}
	}

	const [loading, setLoading] = useState(true)
	useEffect(() => {
		setTimeout(() => {
			setLoading(false)
		}, 1000)
	}, [])

	return (
		<>
			{loading ? (
				<div className="custom-login">
					<Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
						<Spin tip="Loading" size="small">
							<div className="content" />
						</Spin>
					</Space>
				</div>
			) : (
				<>{handleBeginRoute()}</>
			)}
		</>
	)
}

export default RenderedComponent
