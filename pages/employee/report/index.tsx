// employee.tsx
import { Badge, Button } from 'antd'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { EditOutlined } from '@ant-design/icons'

const QuillEditor = dynamic(() => import('react-quill'), {
	ssr: false,
})
import 'react-quill/dist/quill.snow.css'
import Link from 'next/link'

interface EmployeeProps {}

const EmployeeReport: React.FC<EmployeeProps> = () => {
	const [shouldRenderQuill, setShouldRenderQuill] = useState(false)
	const [showEditor, setShowEditor] = useState(true)
	const [contentEditor, setContentEditor] = useState('')

	useEffect(() => {
		setShouldRenderQuill(true)
	}, [])
	const handleChangeValue = (content, delta, source, editor) => {
		console.log(editor.getText(), 'ff')

		if (editor.getText() !== '') {
			setContentEditor(editor.getText())
		}
	}
	const handleShow = () => {
		setShowEditor(!showEditor)
	}
	const modules = {
		toolbar: {
			container: '#toolbar',
		},
	}
	const formats = [
		'font',
		'size',
		'bold',
		'italic',
		'underline',
		'strike',
		'color',
		'background',
		'script',
		'header',
		'blockquote',
		'code-block',
		'indent',
		'list',
		'direction',
		'align',
		'link',
		'image',
		'video',
		'formula',
	]
	const renderItem = (contentEditor) => {
		return (
			<div>
				<h4>Nội dung:</h4>
				<div
					style={{
						border: '1px solid #c9c9ff',
						borderRadius: '5px',
						padding: '5px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: '#f2fcff',
						boxShadow: 'rgba(0, 0, 0, 0.25) -1px 1px 13px, rgba(0, 0, 0, -2.78) 0px 59px 25px',
					}}
				>
					<p style={{ padding: 0, margin: 0 }}>{contentEditor}</p>
					<span>
						<Button icon={<EditOutlined />} onClick={handleShow}></Button>
					</span>
				</div>
			</div>
		)
	}
	return (
		<div>
			{/* <h1 className="text-3xl font-bold underline w-full p-3 bg-slate-400">Hello world!</h1> */}
			<h2>Báo cáo ngày</h2>

			<div style={{ marginBottom: '10px' }}>
				Số công đã chấm (30 ngày): <Badge count={2} />
				<div>
					Danh sách nội dung: <Link href={''}>Xem danh sách của bạn</Link>
				</div>
				{!showEditor && contentEditor && renderItem(contentEditor)}
			</div>

			{shouldRenderQuill && showEditor && (
				<QuillEditor
					style={{ marginBottom: '10px' }}
					value={contentEditor}
					onChange={handleChangeValue}
				/>
			)}
			{showEditor && (
				<Button
					type="primary"
					style={{ marginLeft: 'auto' }}
					onClick={handleShow}
					disabled={!contentEditor}
				>
					Báo cáo
				</Button>
			)}
			{/* <div style={{ display: 'flex' }}>
				<button style={{ flexGrow: '1' }}>aaaa</button>
				<button style={{ flexGrow: '1' }}>bbbbbbbb</button>
				<button style={{ flexGrow: '1' }}>cccc</button>
			</div> */}
		</div>
	)
}

export default EmployeeReport
