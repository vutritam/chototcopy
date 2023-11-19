import React, { useEffect, useState } from 'react'
import { Avatar, Button, List, MenuProps, Skeleton, Space } from 'antd'
import Link from 'next/link'
import CommonShowHistory from '../common/commonShowHistory'
import CommonCollapseItem from '../common/commonCollapse'
import CommonFilter from '../common/commonFilter'
import InputDateTime from '../common/inputDateTime'
import { UserAddOutlined, FileSearchOutlined } from '@ant-design/icons'
import CommonDropdown from '../common/commonDropdown'
import CommonAddEmployee from '../common/commonModalAddEmployee'
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'

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

const count = 3
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`

const List_manage_employee: React.FC = () => {
	const [initLoading, setInitLoading] = useState(true)
	const [loading, setLoading] = useState(false)
	const [showHistory, setShowHistory] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	const [list, setList] = useState<DataType[]>([])

	useEffect(() => {
		fetch(fakeDataUrl)
			.then((res) => res.json())
			.then((res) => {
				setInitLoading(false)
				setData(res.results)
				setList(res.results)
			})
	}, [])

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
	const handleShowModalHistory = () => {
		setShowHistory(!showHistory)
	}
	const [modal2Open, setModal2Open] = useState(false)
	const [titleModal, setTitleModal] = useState('')
	const handleModal = (event: any, value: boolean, title: string) => {
		console.log('ok vào nhé')
		setTimeout(() => {
			setModal2Open(value)
		}, 100)
		setTitleModal(title)
	}
	const handleDropdown = (e: any, value: boolean) => {
		console.log('ok vào nhé')
		setModal2Open(value)
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

	// nơi làm việc
	const items: MenuProps['items'] = [
		{
			key: '1',
			value: 'Hóc môn quận 12',
			label: <p>Hóc môn quận 12</p>,
		},
		{
			key: '2',
			value: 'Tân chánh hiệp ',
			label: (
				<p>Tân chánh hiệp </p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
			// label: <p>1st menu item</p>,
		},
		{
			key: '3',
			value: 'Tân bình',
			label: (
				<p>Tân bình</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
		},
	]
	// ca làm việc
	const works: MenuProps['items'] = [
		{
			key: '1',
			value: 'ca 1',
			label: (
				<p>ca 1</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
		},
		{
			key: '2',
			value: 'ca 2',
			label: (
				<p>ca 2</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
			// label: <p>1st menu item</p>,
		},
		{
			key: '3',
			value: 'ca 3',
			label: (
				<p>ca 3</p>
				// <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
				// </a>
			),
		},
	]

	const itemsAdd: MenuProps['items'] = [
		{
			key: '1',
			value: 'Đăng ký nhân viên mới',
			label: (
				<p onClick={(e) => handleModal(e, true, 'Đăng ký nhân viên mới')}>Đăng ký nhân viên mới</p>
			),
		},
		{
			key: '2',
			value: 'Thêm mới nhân viên',
			label: <p onClick={(e) => handleModal(e, true, 'Thêm mới nhân viên')}>Thêm mới nhân viên</p>,
		},
	]

	const [state, setState] = useState({
		locationWork: 'Chọn nơi làm việc',
		timeWork: 'Chọn ca',
		dateTime: '',
	})
	const handleLocationChange = (field, value) => {
		// console.log(data, 'eee')
		setState({ ...state, [field]: value })
	}

	const onChangeDateTime = (
		value: DatePickerProps['value'] | RangePickerProps['value'],
		dateString: [string, string] | string
	) => {
		setState({ ...state, dateTime: dateString })
		console.log('Selected Time: ', value)
		console.log('Formatted Selected Time: ', dateString)
	}
	const handleSubmit = () => {
		setInitLoading(true)
		// call api from server for research item on list employee
		setTimeout(() => {
			setInitLoading(false)
		}, 1000)
	}

	return (
		<>
			<div
				style={{
					position: 'sticky',
					top: '10%',
					zIndex: 11,
					background: 'rgb(255 255 255)',
					padding: '8px',
					boxShadow:
						'rgba(17, 18, 18, 0.18) 0px 1px 8px 0px, rgba(103, 151, 255, 0.11) 0px 2px 18px 0px',
				}}
			>
				<Space direction="vertical">
					<Space wrap>
						<InputDateTime onChangeTime={onChangeDateTime} />
						<CommonFilter
							fieldName="locationWork"
							items={items}
							state={state.locationWork}
							handleLocationChange={handleLocationChange}
						/>
						<CommonFilter
							fieldName="timeWork"
							items={works}
							state={state.timeWork}
							handleLocationChange={handleLocationChange}
						/>
						<Button type="primary" icon={<FileSearchOutlined />} onClick={handleSubmit}>
							Tìm kiếm
						</Button>
					</Space>
				</Space>
			</div>
			{/* <Space style={{ padding: '10px 0', width: '100%' }}>
				<Button
					style={{
						justifyContent: 'end',
						boxShadow:
							'rgba(17, 18, 18, 0.18) 0px 2px 6px 0px, rgba(103, 151, 255, 0.11) 0px 5px 21px 0px',
					}}
					type="default"
					icon={<UserAddOutlined />}
				>
					<CommonDropdown
						trigger={['click']}
						tittle="Thêm"
						items={itemsAdd}
						handleDropdown={handleDropdown}
					/>
					<CommonAddEmployee open={modal2Open} handleModal={handleModal} title={titleModal} />
				</Button>
			</Space> */}

			<List
				// style={{
				// 	maxHeight: '100vh',
				// 	overflow: 'auto',
				// }}
				className="demo-loadmore-list"
				loading={initLoading}
				itemLayout="horizontal"
				loadMore={loadMore}
				dataSource={list}
				renderItem={(item) => (
					<List.Item
						actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
					>
						<Skeleton avatar title={false} loading={item.loading} active>
							<List.Item.Meta
								avatar={<Avatar src={item.picture.large} />}
								title={<a href="https://ant.design">{item.name?.last}</a>}
								description={
									<>
										<p>19/09/2023</p>
										<p>
											Ant Design, a design language for background List_manage_employeelications, is
											refined by Ant UED Team
										</p>
									</>
								}
							/>
							<div>
								{/* <Link onClick={() => handleShowModalHistory()}> */}
								<CommonShowHistory
									label="Lịch sử hoạt động"
									tittle="Thông tin nhân viên"
									open={showHistory}
									handleShow={handleShowModalHistory}
								/>

								{/* </Link> */}
							</div>
						</Skeleton>
					</List.Item>
				)}
			/>
		</>
	)
}

export default List_manage_employee
