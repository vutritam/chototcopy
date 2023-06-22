import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { asyncGetList, asyncWrapper } from '../../helper/asyncHelper'
import axiosConfig from '../../pages/api/axiosConfigs'

export const fetchCreateOrder = createAsyncThunk('api/fetchCreateOrder', async (options) => {
	let response = await axiosConfig.post('/order/createOrder', options)
	return response.data
})

export const fetchAllOrder = createAsyncThunk('api/fetchAllOrder', async (options) => {
	let response = await axiosConfig.post('/order/getAllOrderByLocation', options)
	return response.data
})

export const fetchOrderByNumberTable = createAsyncThunk(
	'api/fetchOrderByNumberTable',
	async (options) => {
		let response = await axiosConfig.post('/order/getAllOrderByNumberTable', options)
		return response.data
	}
)

const orderSlice = createSlice({
	name: 'dataOrder',
	initialState: {
		dataOrder: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
		dataOrderByNumberTable: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
	},
	reducers: {
		setOrder: (state, action) => {
			state.dataOrder.data = action.payload
		},
		setOrderByNumberTable: (state, action) => {
			state.dataOrderByNumberTable.data = action.payload
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
			.addCase(fetchOrderByNumberTable.pending, (state) => {
				state.dataOrderByNumberTable.loading = true
			})
			.addCase(fetchOrderByNumberTable.fulfilled, (state, action) => {
				state.dataOrderByNumberTable.loading = false
				state.dataOrderByNumberTable.data = action.payload
			})
			.addCase(fetchOrderByNumberTable.rejected, (state, action) => {
				state.dataOrderByNumberTable.loading = false
				state.dataOrderByNumberTable.error = action.error.message || ''
			})
	},
})

const { reducer, actions } = orderSlice

export const { setOrder, setOrderByNumberTable } = actions

export default reducer
