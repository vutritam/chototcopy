import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { asyncGetList, asyncWrapper } from '../../helper/asyncHelper'
import axiosConfig from '../../pages/api/axiosConfigs'

export const fetchMessageFromServer = createAsyncThunk<any, string>(
	'api/fetchMessageFromServer',
	async (options) => {
		let response = await axiosConfig.post('/notification', options, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return response.data
	}
)

const messageSocketSlice = createSlice({
	name: 'messageSocket',
	initialState: {
		message: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
	},
	reducers: {
		setMessage: (state, action) => {
			state.message.data = action.payload
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
	},
})

const { reducer, actions } = messageSocketSlice

export const { setMessage } = actions

export default reducer
