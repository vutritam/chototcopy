import { Breadcrumb } from 'antd'
import { useRouter } from 'next/router'

export const BreadcrumbItem = () => {
	const router = useRouter()
	const parts = router.pathname
	const trimmedPath = parts.startsWith('/') ? parts.substring(1) : parts
	const checkArrayPathName = trimmedPath.replace(/[\[\]]/g, '')
	const finalPath = checkArrayPathName.split('/')

	const renderBreadcrumb = (intitalValue: any) => {
		return (
			<Breadcrumb style={{ margin: '16px 0' }}>
				{intitalValue?.map((item, index) => (
					<Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
				))}
			</Breadcrumb>
		)
	}
	return renderBreadcrumb(finalPath)
}
