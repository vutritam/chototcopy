// employee.tsx
import React, { useEffect, useState } from 'react'

const Manage_Table: React.FC = () => {
	return (
		<>
			<div
				style={{
					display: 'flex',
					gap: '10px',
					marginTop: '30px',
					flexWrap: 'wrap',
					width: '100%',
					justifyContent: 'space-evenly',
				}}
			>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 1</h2>
					<p>Mã QR: 2121212</p>
				</div>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 2</h2>
				</div>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 3</h2>
				</div>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 3</h2>
				</div>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 3</h2>
				</div>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 3</h2>
				</div>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 3</h2>
				</div>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 3</h2>
				</div>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 3</h2>
				</div>
				<div className="flex-table">
					<h2 style={{ color: 'blue' }}>Bàn số 3</h2>
				</div>
			</div>
		</>
	)
}

export default Manage_Table
