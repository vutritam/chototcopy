import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { encodeTableNumber } from '@/components/common/hashCode'
import { Button, Input, Select, Tree } from 'antd'
import { FileOutlined, LockOutlined } from '@ant-design/icons'
import Link from 'next/link'
import type { GetProps, TreeDataNode } from 'antd'
import Toasty from '../common/toasty'
import { useRouter } from 'next/router'
import axiosConfig from '../../pages/api/axiosConfigs'
import _ from 'lodash'
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>
const { DirectoryTree } = Tree
const QRcode: React.FC = () => {
	const router = useRouter()
	const treeData: TreeDataNode[] = [
		{
			title: 'Danh sách toàn bộ QR code',
			key: '0-0',
			children: [],
		},
	]
	let userRoles = sessionStorage.getItem('user') !== null && sessionStorage.getItem('user')

	const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
		console.log('Trigger Select', keys, info)
	}

	const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
		console.log('Trigger Expand', keys, info)
	}
	const [treeDataQr, setTreeDataQr] = useState(treeData)
	const [dataQR, setData] = useState<Array<object>>([])
	const [value, setValue] = useState(0)
	const [location, setLocation] = useState<string>('')
	const [listLocation, setListLocation] = useState([])
	const fetchData = async () => {
		let responseQr = await axiosConfig.get(`/qrcode/getAll`)

		if (responseQr.data.success) {
			const groupedByTableNumber = _.groupBy(
				responseQr.data.data,
				(item) => item.locationId?.nameLocation
			)
			const countByClass = _.map(groupedByTableNumber, (group, locationId) => ({
				length: group.length,
				location: locationId,
			}))

			let treeDataClone: TreeDataNode[] = [...treeDataQr]
			treeDataClone[0].key = '0-0'
			treeDataClone[0].children = countByClass.map((item, index) => ({
				title: (
					<Link href={`${router.asPath}/${item?.location}`}>Danh sách QR code {item.location}</Link>
				),
				key: `0-0-${index}`,
			}))
			setTreeDataQr(treeDataClone)
		}
	}

	useEffect(() => {
		fetchData()
		const fetchLocation = async () => {
			let response = await axiosConfig.get(`/location/getAllLocation`)

			if (response.data.success) {
				setListLocation(response.data.data)
			} else {
				Toasty.error(response.data.message)
			}
		}
		fetchLocation()
	}, [])

	const handleRandomTable = () => {
		let array: Array<object> = []

		if (isNaN(value) || value <= 0) {
			alert('Vui lòng nhập số hợp lệ')
			return
		} else if (value > 100) {
			alert('Không vượt quá 100')
			return
		}

		let convertNumber = Number(value)
		for (let index = 1; index <= convertNumber; index++) {
			let table = {
				title: `bàn số ${index}`,
				tableNumber: index,
				linkOrder: `http://localhost:3000/order/${encodeTableNumber(index)}`,
				code: encodeTableNumber(index),
			}

			if (!array.includes(table)) {
				array.push(table)
			}
		}
		setData(array)
		return
	}
	const handleSaveQrCode = async () => {
		const dataUser = JSON.parse(userRoles)
		const dataArray = dataQR.map((item) => ({
			title: item.title,
			locationId: location,
			code: item.code,
			tableNumber: item.tableNumber,
			userId: dataUser?.data?.userId,
		}))

		if (dataArray) {
			let response = await axiosConfig.post(`/qrcode/add`, dataArray)
			if (response.data.success) {
				fetchData()
				Toasty.success(response.data.message)
			}
		}
		setData([])
	}

	const handleSaveLocation = (value: string) => {
		setLocation(value)
	}

	return (
		<div className="App">
			<h3>Tạo mới QR code</h3>
			<div style={{ width: '400px', display: 'flex', gap: '4px' }}>
				{!location ? (
					<Select
						suffixIcon={<LockOutlined className="site-form-item-icon" />}
						placeholder="Nhập địa điểm"
						onChange={handleSaveLocation}
						style={{ width: '400px' }}
					>
						{listLocation?.map((item, index) => (
							<>
								<Select.Option key={index} value={item?._id}>
									{item?.nameLocation}
								</Select.Option>
							</>
						))}
					</Select>
				) : (
					<>
						<Input
							placeholder="nhập số lượng bàn"
							onChange={(e) => setValue(Number(e?.target?.value) || 0)}
						/>
						<Button type="default" onClick={() => handleRandomTable()}>
							Tạo QR
						</Button>
						{dataQR?.length > 0 && (
							<Button type="primary" icon={<FileOutlined />} onClick={handleSaveQrCode}>
								Lưu lại danh sách
							</Button>
						)}
					</>
				)}
			</div>

			{dataQR?.length <= 0 && (
				<>
					<p style={{ marginTop: '15px' }}>Danh sách QR code sẽ hiển thị tại đây: </p>
					<DirectoryTree
						multiple
						defaultExpandAll
						onSelect={onSelect}
						onExpand={onExpand}
						treeData={treeDataQr}
					/>
				</>
			)}

			<div
				style={{
					display: 'flex',
					width: '100%	',
					flexWrap: 'wrap',
					gap: '10px',
					marginTop: '10px',
				}}
			>
				{dataQR?.map((e, index) => (
					<div key={index}>
						<h2>Bàn số: {index + 1}</h2>
						<div>Code: {e?.code}</div>
						<QRCode key={index} value={e?.linkOrder} size={100} />
						<br />
					</div>
				))}
			</div>
		</div>
	)
}

export default QRcode
