import React from 'react'
import RenderedComponent from '@/components/common/renderComponent'
import withAuthorization from '@/components/common/privateRoute'

const Employee: React.FC = () => {
	return (
		<>
			<RenderedComponent />
		</>
	)
}

export default withAuthorization(Employee, ['client'])
