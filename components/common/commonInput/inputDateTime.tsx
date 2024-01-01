import { DatePicker, Space } from 'antd'
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'

interface inputProps {
	timeDefault?: String
	onChangeTime?: (
		value: DatePickerProps['value'] | RangePickerProps['value'],
		dateString: [string, string] | string
	) => void
}
const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
	console.log('onOk: ', value)
}

const InputDateTime = (props: inputProps): JSX.Element => {
	const { onChangeTime } = props
	return (
		<Space direction="vertical" size={12}>
			<DatePicker showTime onChange={onChangeTime} onOk={onOk} />
		</Space>
	)
}

export default InputDateTime
