import React, { forwardRef } from 'react'
import { CopyOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
const RnderToPrint = (props: any, ref: any) => {
	const { dataSubmit, edit, totalPrice, userData, handleChangeData, handleForcusOut, handleEdit } =
		props

	return (
		<div>
			<div ref={ref} style={{ padding: '10px' }}>
				<div
					style={{
						textAlign: 'center',
						fontSize: 26,
						fontWeight: 'bold',
						marginBottom: '0px',
					}}
				>
					Hoá đơn thanh toán
				</div>
				<div style={{ textAlign: 'left' }}>
					<div
						style={{
							textAlign: 'center',
							fontSize: 26,
							fontWeight: 'bold',
							marginBottom: '6px',
						}}
					></div>
					<span>Tổng bill: {totalPrice}</span>
					{edit.name === 'phone' && edit.isShow ? (
						<Input
							onChange={(e) => handleChangeData('phone', e?.target?.value)}
							name="phone"
							onBlur={handleForcusOut}
							value={userData.phone}
						/>
					) : (
						<div className="parent_show">
							<span style={{ fontSize: 14, padding: 0, margin: 0 }} className="limit_text">
								SDT: {userData.phone}
							</span>
							<Button
								className="btn_show"
								icon={<EditOutlined />}
								onClick={() => handleEdit('phone')}
								style={{ marginLeft: '10px' }}
							/>
						</div>
					)}
					{edit.name === 'name' && edit.isShow ? (
						<Input
							onChange={(e) => handleChangeData('name', e?.target?.value)}
							name="name"
							onBlur={handleForcusOut}
							value={userData.tableNumber}
						/>
					) : (
						<div className="parent_show">
							<span className="limit_text">
								Số bàn: {JSON.stringify(dataSubmit[0].tableNumber)}
							</span>{' '}
							<Button
								className="btn_show"
								icon={<EditOutlined />}
								onClick={() => handleEdit('name')}
								style={{ marginLeft: '10px' }}
							/>
						</div>
					)}
					{edit.name === 'address' && edit.isShow ? (
						<Input
							onChange={(e) => handleChangeData('address', e?.target?.value)}
							name="address"
							onBlur={handleForcusOut}
							value={userData.address}
						/>
					) : (
						<div
							style={{
								fontSize: 14,
								padding: 0,
								margin: 0,
								display: 'flex',
								alignItems: 'center',
								width: '80%',
							}}
							className="parent_show"
						>
							<div className="limit_text">Địa chỉ: {userData.address}</div>
							<Button
								className="btn_show"
								icon={<EditOutlined />}
								onClick={() => handleEdit('address')}
								style={{ marginLeft: '10px' }}
							/>
						</div>
					)}
				</div>

				<table>
					<thead>
						<th style={{ textAlign: 'start', fontSize: 14 }}>STT</th>
						<th style={{ textAlign: 'start' }}>Sản phẩm</th>
						<th style={{ textAlign: 'start' }}>Số lượng</th>
						<th style={{ textAlign: 'start' }}>Giá tiền</th>
					</thead>
					<tbody style={{ fontSize: 14, textAlign: 'start' }}>
						{dataSubmit?.map((item, index) => {
							return (
								<tr key={index}>
									<td>
										<hr />
										&nbsp;
									</td>
									<td>
										<hr />
										{item?.productId?.name}
									</td>
									<td>
										<hr />
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-
									</td>
									<td>
										<hr />
										{item?.productId?.price}
									</td>
								</tr>
							)
						})}
						<tr>
							<td>
								<hr />
							</td>
							<td>
								<hr />
							</td>
							<td>
								<hr />
							</td>
							<td>
								<hr />
							</td>

							<br />
						</tr>
						<tr>
							<td>&nbsp;</td>

							<td>Phí vận chuyển</td>
							<td>Charges</td>
							<td>0</td>
						</tr>

						<tr>
							<td>
								&nbsp;
								<hr />
							</td>
							<td>
								Thuế
								<hr />
							</td>
							<td>
								Charges
								<hr />
							</td>
							<td>
								0<hr />
							</td>
						</tr>

						<tr>
							<td>
								&nbsp;
								<hr />
							</td>
							<td>
								<b>Tổng thanh toán</b>
								<hr />
							</td>
							<td>
								&nbsp;
								<hr />
							</td>
							<td>
								<b>{totalPrice}</b>
								<hr />
							</td>
						</tr>
					</tbody>
				</table>
				<div style={{ textAlign: 'center', fontSize: 16, marginTop: '10px' }}>
					<div>**********************</div>
					THANK YOU FOR ORDER GOLD COFFEE
					<div>**********************</div>
				</div>
			</div>
			<br />
			<br />
			<br />
			<br />
			<br />
			{/* new Order Part */}
		</div>
	)
}
export default forwardRef(RnderToPrint)
