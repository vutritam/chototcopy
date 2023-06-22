import React, { useState } from 'react'
import { Button, Col, DatePicker, Form, Input, Row } from 'antd'
import FileUpload from '@/components/common/upload'
import { useDispatch } from 'react-redux'
import { fetchCreateProduct } from '@/redux/componentSlice/productSlice'
import Toasty from '@/components/common/toasty'

type RequiredMark = boolean | 'optional'

const Products: React.FC = () => {
	const [form] = Form.useForm()
	const [requiredMark, setRequiredMarkType] = useState<RequiredMark>('optional')
	const [loadings, setLoadings] = useState<boolean>(false)
	const [UploadImg, setUpload] = useState({ image: '' })
	const dispatch = useDispatch()
	const onRequiredTypeChange = ({ requiredMarkValue }: { requiredMarkValue: RequiredMark }) => {
		setRequiredMarkType(requiredMarkValue)
	}

	const onFinish = async (values: any) => {
		const formData = new FormData()
		formData.append('name', values.name)
		formData.append('price', values.price)
		formData.append('quantity', values.quantity)
		formData.append('file', UploadImg.image.file.originFileObj)
		formData.append('Description', values.Description)
		formData.append('EndDate', values.EndDate)
		const { payload } = await dispatch(fetchCreateProduct(formData))

		if (payload?.success) {
			setTimeout(() => {
				setLoadings(false)
				Toasty.success(payload?.message)
			}, 1000)
			return
		}
		Toasty.error(payload?.message)
		// console.log('Received values of form: ', values.EndDate.format('YYYY-MM-DD HH:mm:ss'))
	}

	return (
		<Form
			form={form}
			layout="vertical"
			onFinish={onFinish}
			initialValues={{ requiredMarkValue: requiredMark }}
			onValuesChange={onRequiredTypeChange}
			requiredMark={requiredMark}
		>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col className="gutter-row" span={12}>
					<Form.Item
						label={<strong>Tên sản phẩm</strong>}
						name="name"
						required
						tooltip="This is a required field"
						rules={[{ required: true, message: 'Vui lòng nhập Tên sản phẩm!' }]}
					>
						<Input placeholder="Tên sản phẩm" />
					</Form.Item>
				</Col>
				<Col className="gutter-row" span={12}>
					<Form.Item
						label={<strong>Ngày hết hạn</strong>}
						name="EndDate"
						required
						tooltip="This is a required field"
						rules={[{ required: true, message: 'Vui lòng nhập Ngày hết hạn!' }]}
					>
						<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Ngày hết hạn" />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col className="gutter-row" span={12}>
					<Form.Item
						label={<strong>Giá sản phẩm</strong>}
						name="price"
						required
						tooltip="This is a required field"
						rules={[{ required: true, message: 'Vui lòng nhập Giá sản phẩm!' }]}
					>
						<Input type="number" placeholder="Giá sản phẩm" />
					</Form.Item>
				</Col>
				<Col className="gutter-row" span={12}>
					<Form.Item
						label={<strong>Mô tả </strong>}
						name="Description"
						required
						tooltip="This is a required field"
						rules={[{ required: true, message: 'Vui lòng nhập Mô tả!' }]}
					>
						<Input placeholder="Mô tả" />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col className="gutter-row" span={12}>
					<Form.Item
						label={<strong>Số lượng</strong>}
						name="quantity"
						required
						tooltip="This is a required field"
						rules={[{ required: true, message: 'Vui lòng nhập Số lượng!' }]}
					>
						<Input placeholder="Số lượng" />
					</Form.Item>
				</Col>
				<Col className="gutter-row" span={12}>
					<Form.Item
						label={<strong>Hình ảnh</strong>}
						name="file"
						tooltip="This is a required field"
					>
						<FileUpload setUpload={setUpload} />
					</Form.Item>
				</Col>
			</Row>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					Tạo sản phẩm
				</Button>
			</Form.Item>
		</Form>
	)
}

export default Products
