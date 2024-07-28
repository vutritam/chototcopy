import React, { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'

interface InputData {
	setUpload: any
	dataImage?: any
}
const FileUpload = (props: InputData): JSX.Element => {
	const { setUpload, dataImage } = props
	const [upImage, setUpImage] = useState<UploadFile[]>([])

	const fileList: UploadFile[] =
		dataImage !== undefined
			? [
					{
						uid: '1',
						name: dataImage,
						status: 'done',
						url: dataImage,
					},
			  ]
			: []

	const handleUpload = (value: any) => {
		setUpImage(value)
		setUpload({ image: value })
	}

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
				<Button icon={<UploadOutlined />}>Upload</Button>
			</Upload>
		</>
	)
}

export default FileUpload
