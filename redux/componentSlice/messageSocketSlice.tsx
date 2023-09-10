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

const messageSocketSlice = createSlice({
	name: 'messageSocket',
	initialState: {
		message: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
		messageEmployee: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
	},
	reducers: {
		setMessage: (state, action) => {
			state.message.data = action.payload
		},
		setMessageEmployee: (state, action) => {
			state.messageEmployee.data = action.payload
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
				state.messageEmployee.loading = false
				state.messageEmployee.data = action.payload
			})
			.addCase(fetchMessageByUserRole.rejected, (state, action) => {
				state.messageEmployee.loading = false
				state.messageEmployee.error = action.error.message || ''
			})
	},
})

const { reducer, actions } = messageSocketSlice

export const { setMessage, setMessageEmployee } = actions

export default reducer
