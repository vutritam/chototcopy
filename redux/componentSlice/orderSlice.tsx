import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { asyncGetList, asyncWrapper } from '../../helper/asyncHelper'
import axiosConfig from '../../pages/api/axiosConfigs'

export const fetchCreateOrder = createAsyncThunk('api/fetchCreateOrder', async (options) => {
	let response = await axiosConfig.post('/order/createOrder', options, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
	return response.data
})

const orderSlice = createSlice({
	name: 'dataOrder',
	initialState: {
		dataOrder: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
	},
	reducers: {
		setOrder: (state, action) => {
			state.dataOrder.data = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCreateOrder.pending, (state) => {
				state.dataOrder.loading = true
			})
			.addCase(fetchCreateOrder.fulfilled, (state, action) => {
				state.dataOrder.loading = false
				state.dataOrder.data = action.payload
			})
			.addCase(fetchCreateOrder.rejected, (state, action) => {
				state.dataOrder.loading = false
				state.dataOrder.error = action.error.message || ''
			})
	},
})

const { reducer, actions } = orderSlice

export const { setOrder } = actions

export default reducer
