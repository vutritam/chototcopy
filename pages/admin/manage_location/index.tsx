import React, { useEffect, useState } from 'react'
import { FileAddOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { Avatar, Button, List, Skeleton } from 'antd'
import ModalAddLocation from '@/components/modalAddLocation/modalAddLocation'
import Toasty from '@/components/common/toasty'
import axiosConfig from '../../api/axiosConfigs'

interface DataType {
	gender?: string
	name: {
		title?: string
		first?: string
		last?: string
	}
	email?: string
	picture: {
		large?: string
		medium?: string
		thumbnail?: string
	}
	nat?: string
	loading: boolean
}

const Manage_Location: React.FC = () => {
	const [initLoading, setInitLoading] = useState(true)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	const [list, setList] = useState<DataType[]>([])
	const [listLocation, setListLocation] = useState([])
	const [dataLocation, setDataLocation] = useState({
		nameLocation: '',
		quantityEmployee: 0,
	})
	const fetchData = async () => {
		let response = await axiosConfig.get(`/location/getAllLocation`)
		setInitLoading(true)

		if (response.data.success) {
			setInitLoading(false)
			setListLocation(response.data.data)
		} else {
			Toasty.error(response.data.message)
		}
	}
	useEffect(() => {
		fetchData()
	}, [])

	const onFinish = async () => {
		let response = await axiosConfig.post(`/location/addLocation`, dataLocation)
		if (response.data.success) {
			Toasty.success(response.data.message)
			fetchData()
		} else {
			Toasty.error(response.data.message)
		}
	}
	console.log(listLocation, 'listLocation')

	const onChangeDataLocation = (field: string, value: any) => {
		setDataLocation({ ...dataLocation, [field]: value })
	}

	const onLoadMore = () => {
		setLoading(true)
		setList(
			data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} })))
		)
		fetch(fakeDataUrl)
			.then((res) => res.json())
			.then((res) => {
				const newData = data.concat(res.results)
				setData(newData)
				setList(newData)
				setLoading(false)
				// Resetting window's offsetTop so as to display react-virtualized demo underfloor.
				// In real scene, you can using public method of react-virtualized:
				// https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
				window.dispatchEvent(new Event('resize'))
			})
	}

	const loadMore =
		!initLoading && !loading ? (
			<div
				style={{
					textAlign: 'center',
					marginTop: 12,
					height: 32,
					lineHeight: '32px',
				}}
			>
				<Button onClick={onLoadMore}>loading more</Button>
			</div>
		) : null

	return (
		<>
			<ModalAddLocation
				title="Thêm địa điểm mới"
				label="Thêm địa điểm"
				dataLocation={dataLocation}
				onChangeDataLocation={onChangeDataLocation}
				onFinish={onFinish}
			/>
			<List
				className="demo-loadmore-list"
				loading={initLoading}
				itemLayout="horizontal"
				pagination={{
					onChange: (page) => {
						console.log(page)
					},
					pageSize: 3,
				}}
				dataSource={listLocation}
				renderItem={(item) => (
					<List.Item
						actions={[
							<a key="list-loadmore-edit">Xóa</a>,
							<a key="list-loadmore-more">Nhân viên tại đây</a>,
						]}
					>
						<Skeleton avatar title={false} loading={initLoading} active>
							<List.Item.Meta
								avatar={<FileAddOutlined />}
								title={<a href="https://ant.design">{item.nameLocation}</a>}
								description={`Số lượng nhân viên: ${item.quantityEmployee}`}
							/>

							<div>
								<EnvironmentOutlined />
								Xem trên bản đồ
							</div>
						</Skeleton>
					</List.Item>
				)}
			/>
		</>
	)
}

export default Manage_Location
