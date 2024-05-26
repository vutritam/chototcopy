import React, { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import { isArray } from 'lodash'
import type { UploadFile } from 'antd/es/upload/interface'
import { useRouter } from 'next/router'

const FileUpload: React.FC = ({ setUpload, dataImage }) => {
	const [upImage, setUpImage] = useState<UploadFile[]>([])
	const router = useRouter()
	console.log(dataImage, 'dataImage')

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
