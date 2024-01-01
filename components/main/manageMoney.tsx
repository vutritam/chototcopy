import { Button, Dropdown, Space } from 'antd'
import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import ModalConfirm from '@/components/common/commonModal/modalConfirm'
type Props = {}

export default function ManageMoney({}: Props) {
	const [openThu, setOpenThu] = useState(false)

	const items: MenuProps['items'] = [
		{
			key: '1',
			label: (
				<ModalConfirm
					label="Tạo trình thu"
					title="Tạo phiếu thu"
					position="renderComfirmThu"
					open={openThu}
					setOpen={setOpenThu}
					size={1000}
				/>
			),
		},
		{
			key: '2',
			label: <ModalConfirm label="Tạo trình chi" title="Tạo phiếu chi" size={1000} />,
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
