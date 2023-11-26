import React, { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'

const fileList: UploadFile[] = []

const FileUpload: React.FC = ({ setUpload }) => {
	const [upImage, setUpImage] = useState<UploadFile[]>([])
	// const onChangeList = (value: any) => {
	// 	// console.log({ ...value, file: { ...value.file, status: 'done' } })
	// }
	// console.log(upImage, 'file list')

	const handleUpload = (value: any) => {
		// let data = {
		// 	uid: file.file.uid,
		// 	name: file.file.name,
		// 	status: 'done',
		// 	thumbUrl: file.file.thumbUrl,
		// }
		console.log(value, 'upImage')

		setUpImage(value)

		setUpload({ image: value })
	}
	console.log(upImage, 'upImage')
	return (
		<>
			<Upload
				// action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
				listType="picture"
				// disabled={upImage?.fileList?.length > 0 && true}
				accept=".jpg, .jpeg, .png"
				onChange={handleUpload}
				defaultFileList={[...fileList]}
			>
				<Button
					disabled={upImage?.fileList && upImage?.fileList.name && true}
					icon={<UploadOutlined />}
				>
					Upload
				</Button>
			</Upload>
		</>
	)
}

export default FileUpload
