import { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/storage'
import { imgDB } from '@/firebase/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const useImageUpload = () => {
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(false)

	const uploadImage = async (file, folderAddPath) => {
		setUploading(true)
		setError(null)

		try {
			const fileObj = file?.originFileObj
			const storageRef = ref(imgDB, `${folderAddPath}/${fileObj?.uid}`)

			// Đợi việc tải lên hoàn tất
			await uploadBytes(storageRef, fileObj)

			// Lấy URL tải xuống
			const downloadURL = await getDownloadURL(storageRef)
			setSuccess(true)
			return downloadURL
		} catch (err) {
			setError(err.message)
			throw err
		} finally {
			setUploading(false)
		}
	}

	return { uploading, error, success, uploadImage }
}

export default useImageUpload
