import React, { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import { isArray } from 'lodash'
import type { UploadFile } from 'antd/es/upload/interface'

const FileUpload: React.FC = ({ setUpload, dataImage }) => {
	const [upImage, setUpImage] = useState<UploadFile[]>([])
	const fileList: UploadFile[] = [
		{
			uid: '1',
			name: dataImage,
			status: 'done',
			url: process.env.NEXT_PUBLIC_HOST_CLIENT + `/images/${dataImage}`,
		},
	]

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
