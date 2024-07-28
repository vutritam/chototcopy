import React from 'react'
import { Pagination } from 'antd'

interface InputData {
	data: any
	pageSize: any
	onChangeItem: (value: any) => void
}

const PaginationCustom: React.FC<InputData> = ({ data, pageSize, onChangeItem }) => (
	<Pagination
		total={data}
		onChange={onChangeItem}
		pageSize={pageSize}
		showSizeChanger
		showQuickJumper
		showTotal={(total) => `Total ${total} items`}
	/>
)

export default PaginationCustom
