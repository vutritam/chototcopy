import { Button, Dropdown, Space } from 'antd'
import React from 'react'
import type { MenuProps } from 'antd'
import ModalConfirm from '@/components/common/modalConfirm'
type Props = {}

export default function ManageMoney({}: Props) {
	const items: MenuProps['items'] = [
		{
			key: '1',
			label: <ModalConfirm label="Tạo trình thu" title="Tạo phiếu thu" />,
		},
		{
			key: '2',
			label: <ModalConfirm label="Tạo trình chi" title="Tạo phiếu chi" />,
		},
	]
	return (
		<div>
			<Space direction="vertical">
				<Space wrap>
					<Dropdown menu={{ items }} placement="bottom">
						<Button>Tạo phiếu thu và chi</Button>
					</Dropdown>
				</Space>
			</Space>
		</div>
	)
}
