import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { asyncGetList, asyncWrapper } from '../../helper/asyncHelper'
import axiosConfig from '../../pages/api/axiosConfigs'

export const fetchMessageFromServer = createAsyncThunk<any, any>(
	'api/fetchMessageFromServer',
	async (options) => {
		let response = await axiosConfig.post('/messageData/getMessageByLocation', options)
		return response.data
	}
)

export const fetchMessageByUserRole = createAsyncThunk<any, any>(
	'api/fetchMessageByUserRole',
	async (options) => {
		let response = await axiosConfig.post(
			`/messageData/getMessageByUserRole/${options?.userId}`,
			options
		)
		return response.data
	}
)
// export const fetchMessageConfirmOrderByUser = createAsyncThunk<any, any>(
// 	'api/fetchMessageConfirmOrderByUser',
// 	async (options) => {
// 		let response = await axiosConfig.post(
// 			`/messageData/updateRecordConfirmOrderNotification/${options?.id}`,
// 			options
// 		)
// 		return response.data
// 	}
// )

export const deleteAllRecordNotification = createAsyncThunk<any, any>(
	'api/deleteAllRecordNotification',
	async (options) => {
		let response = await axiosConfig.post(`/messageData/deleteAllNoti`, options)
		return response.data
	}
)

export const getMessageFromServer = createAsyncThunk<any, any>(
	'api/getMessageFromServer',
	async (options) => {
		let response = await axiosConfig.get('/messageData', options)
		return response.data
	}
)

export const updateMessageNotification = createAsyncThunk<any, any>(
	'api/updateMessageNotification',
	async (options) => {
		let response = await axiosConfig.post('/messageData/updateRecordNoti', options)
		return response.data
	}
)

const messageSocketSlice = createSlice({
	name: 'messageSocket',
	initialState: {
		message: { data: [], loading: false, error: '', checkSeen: false }, // 0: options 0 trong menu dropdown client, 1: ...
		messageEmployee: { data: [], loading: false, error: '', checkSeen: false }, // 0: options 0 trong menu dropdown client, 1: ...
		messageAdmin: { data: [], loading: false, error: '', checkSeen: false }, // 0: options 0 trong menu dropdown client, 1: ...
	},
	reducers: {
		setMessage: (state, action) => {
			state.message.data = action.payload
		},
		setMessageEmployee: (state, action) => {
			state.messageEmployee.data = action.payload
		},
		setMessageAdmin: (state, action) => {
			state.messageAdmin.data = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMessageFromServer.pending, (state) => {
				state.message.loading = true
			})
			.addCase(fetchMessageFromServer.fulfilled, (state, action) => {
				state.message.loading = false
				state.message.data = action.payload
			})
			.addCase(fetchMessageFromServer.rejected, (state, action) => {
				state.message.loading = false
				state.message.error = action.error.message || ''
			})
			.addCase(fetchMessageByUserRole.pending, (state) => {
				state.messageEmployee.loading = true
			})
			.addCase(fetchMessageByUserRole.fulfilled, (state, action) => {
				const filterActionAdmin = action.payload.data.filter(
					(element) => element.isPage === 'admin_page'
				)
				const filterActionEmployee = action.payload.data.filter(
					(element) => element.isPage !== 'admin_page'
				)

				state.messageAdmin.loading = false
				state.messageAdmin.data = filterActionAdmin
				state.messageEmployee.loading = false
				state.messageEmployee.data = filterActionEmployee
			})
			.addCase(fetchMessageByUserRole.rejected, (state, action) => {
				const filterActionAdmin = action.payload.data.filter(
					(element) => element.isPage === 'admin_page'
				)
				const filterActionEmployee = action.payload.data.filter(
					(element) => element.isPage !== 'admin_page'
				)
				console.log('vô đây k', filterActionAdmin, filterActionEmployee)

				if (filterActionAdmin) {
					state.messageAdmin.loading = false
					state.messageAdmin.error = action.error.message || ''
				} else if (filterActionEmployee) {
					state.messageEmployee.loading = false
					state.messageEmployee.error = action.error.message || ''
				}
			})
			.addCase(updateMessageNotification.pending, (state) => {
				state.message.loading = true
			})
			.addCase(updateMessageNotification.fulfilled, (state, action) => {
				state.message.loading = false
				state.message.checkSeen = true
			})
			.addCase(updateMessageNotification.rejected, (state, action) => {
				state.message.loading = false
				state.message.error = action.error.message || ''
			})
	},
})

const { reducer, actions } = messageSocketSlice

export const { setMessage, setMessageEmployee, setMessageAdmin } = actions

export default reducer
