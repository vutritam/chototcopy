import React from 'react'
import RenderedComponent from '@/components/common/renderComponent'
import withAuthorization from '@/components/common/privateRoute'

const AdminPage: React.FC = () => {
	return (
		<>
			<RenderedComponent />
		</>
	)
}

export default withAuthorization(AdminPage, ['admin'])
