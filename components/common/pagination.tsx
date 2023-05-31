import React from 'react'
import { Pagination } from 'antd'

const PaginationCustom: React.FC = ({ data, pageSize, onChangeItem }) => (
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
