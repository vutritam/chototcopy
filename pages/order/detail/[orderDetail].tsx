import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Products from '@/components/main/products'
import { decodeNumber, encodeNumber } from '@/components/common/hashCode'
import RenderedComponent from '@/components/common/renderComponent'

const App: React.FC = () => {
	return (
		<>
			<RenderedComponent />
		</>
	)
}

export default App
