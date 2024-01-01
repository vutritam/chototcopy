import * as React from 'react'
import { useCollapse } from 'react-collapsed'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
const ManageWorkShiftItem = ({ isActive }) => {
	const [isExpanded, setExpanded] = React.useState(isActive)
	const { getToggleProps, getCollapseProps } = useCollapse({
		isExpanded,
	})

	React.useEffect(() => {
		setExpanded(isActive)
	}, [isActive, setExpanded])

	return (
		<>
			<div
				className="collapse-container"
				{...getToggleProps({
					style: { display: 'block' },
					onClick: () => setExpanded((x) => !x),
				})}
			>
				{isExpanded ? (
					<>
						<DownOutlined />
					</>
				) : (
					<>
						<RightOutlined />
					</>
				)}
				<span>
					<b>14-02-2023</b>
				</span>
			</div>
			<div {...getCollapseProps()}>
				<h2 style={{ margin: '0 20px' }}>
					<div style={{ marginTop: '10px' }}>
						<div className="bill-container">
							<div className="style-bill">
								Số đơn xác nhận:
								<span style={{ marginLeft: '10px', color: 'green' }}>
									<b>100</b>
								</span>
							</div>
							<div className="style-bill">
								Số đơn hủy:
								<span style={{ marginLeft: '10px', color: 'red' }}>
									<b>100</b>
								</span>
							</div>
							<div className="style-bill">
								Số ca làm việc:
								<span style={{ marginLeft: '10px', color: 'blue' }}>
									<b>100</b>
								</span>
							</div>
							<div className="style-bill">
								Nơi làm việc:
								<span style={{ marginLeft: '10px' }}>
									<b>Tân chánh hiệp quận 12</b>
								</span>
							</div>
						</div>
					</div>
				</h2>
			</div>
		</>
	)
}

export default ManageWorkShiftItem
