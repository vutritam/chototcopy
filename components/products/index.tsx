import React, { useState } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Radio, Row } from 'antd'

type RequiredMark = boolean | 'optional'

const Products: React.FC = () => {
	const [form] = Form.useForm()
	const [requiredMark, setRequiredMarkType] = useState<RequiredMark>('optional')

	const onRequiredTypeChange = ({ requiredMarkValue }: { requiredMarkValue: RequiredMark }) => {
		setRequiredMarkType(requiredMarkValue)
	}

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={{ requiredMarkValue: requiredMark }}
			onValuesChange={onRequiredTypeChange}
			requiredMark={requiredMark}
		>
			<Form.Item label="Required Mark" name="requiredMarkValue">
				<Radio.Group>
					<Radio.Button value="optional">Optional</Radio.Button>
					<Radio.Button value>Required</Radio.Button>
					<Radio.Button value={false}>Hidden</Radio.Button>
				</Radio.Group>
			</Form.Item>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col className="gutter-row" span={6}>
					<Form.Item label="Field A" required tooltip="This is a required field">
						<Input placeholder="input placeholder" />
					</Form.Item>
					<Form.Item
						label="Field B"
						tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
					>
						<Input placeholder="input placeholder" />
					</Form.Item>
				</Col>
				<Col className="gutter-row" span={12}>
					<Form.Item
						label="Field B"
						tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
					>
						<Input placeholder="input placeholder" />
					</Form.Item>
				</Col>
			</Row>

			<Form.Item>
				<Button type="primary">Submit</Button>
			</Form.Item>
		</Form>
	)
}

export default Products
