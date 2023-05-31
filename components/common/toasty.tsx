import { toast } from 'react-toastify'

const Toasty = {
	success: (message: string) => {
		return toast(message, {
			position: 'top-center',
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			isLoading: false,
			draggable: true,
			progress: undefined,
			type: 'success',
		})
	},
	error: (message: string) => {
		return toast(message, {
			position: 'top-center',
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			isLoading: false,
			draggable: true,
			progress: undefined,
			type: 'error',
		})
	},
}

export default Toasty
// return <>{toáty}</>
