import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { asyncGetList, asyncWrapper } from '../../helper/asyncHelper'
import axiosConfig from '../../pages/api/axiosConfigs'

export const fetchCreateOrder = createAsyncThunk<any, any, any>(
	'api/fetchCreateOrder',
	async (options) => {
		let response = await axiosConfig.post('/order/createOrder', options)
		return response.data
	}
)

export const fetchAllOrderByUserRole = createAsyncThunk<any, any, any>(
	'api/fetchAllOrderByUserRole',
	async (options: any) => {
		let response = await axiosConfig.post('/order/getAllOrderByUserRole', options)
		return response.data
	}
)

export const updateStatusOrder = createAsyncThunk<any, any, any>(
	'api/updateStatusOrder',
	async (options) => {
		let response = await axiosConfig.post(`/order/update/status/${options.id}`, options)
		return response.data
	}
)

export const deleteAllRecordOrder = createAsyncThunk<any, any, any>(
	'api/deleteAllRecordOrder',
	async () => {
		let response = await axiosConfig.post(`/order/deleteAllOrder`)
		return response.data
	}
)

export const fetchAllOrder = createAsyncThunk<any, any>('api/fetchAllOrder', async (options) => {
	let response = await axiosConfig.post('/order/getAllOrderByLocation', options)
	return response.data
})

export const fetchOrderByNumberTable = createAsyncThunk<any, any>(
	'api/fetchOrderByNumberTable',
	async (options) => {
		let response = await axiosConfig.post('/order/getAllOrderByNumberTable', options)
		return response.data
	}
)

export const fetchAllOrderByUser = createAsyncThunk<any, any>(
	'api/fetchAllOrderByUser',
	async () => {
		let response = await axiosConfig.get('/order/getAllOrderByUser')
		return response.data
	}
)

export const fetchAllOrderByNumberTableAndLocationUser = createAsyncThunk<any, any>(
	'api/fetchAllOrderByNumberTableAndLocationUser',
	async (options) => {
		let response = await axiosConfig.post('/order/getAllOrderByNumberTableAndLocationUser', options)
		return response.data
	}
)

export const deleteOrder = createAsyncThunk<any, any>('api/deleteOrder', async (options) => {
	let response = await axiosConfig.post('/order/deleteOrder', options)
	return response.data
})

const orderSlice = createSlice({
	name: 'dataOrder',
	initialState: {
		dataOrder: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
		dataOrderByNumberTable: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
		dataAllOrder: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
		dataAllOrderAdmin: { data: null, loading: false, error: '' },
		idNotiConfirm: [],
	},
	reducers: {
		setOrder: (state, action) => {
			state.dataOrder.data = action.payload
		},
		setOrderByNumberTable: (state, action) => {
			state.dataOrderByNumberTable.data = action.payload
		},
		setAllOrder: (state, action) => {
			state.dataAllOrder.data = action.payload
		},
		setIdNotiConfirm: (state, action) => {
			const newId = action.payload
			if (!state.idNotiConfirm.includes(newId)) {
				state.idNotiConfirm.push(newId)
			}
		},
		setAllOrderAdmin: (state, action) => {
			state.dataAllOrderAdmin.data = action.payload
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
				console.log(action.payload, 'action.payload')

				state.dataOrderByNumberTable.loading = false
				state.dataOrderByNumberTable.data = action.payload
			})
			.addCase(fetchOrderByNumberTable.rejected, (state, action) => {
				state.dataOrderByNumberTable.loading = false
				state.dataOrderByNumberTable.error = action.error.message || ''
			})
			.addCase(fetchAllOrderByUser.pending, (state) => {
				state.dataAllOrder.loading = true
			})
			.addCase(fetchAllOrderByUser.fulfilled, (state, action) => {
				state.dataAllOrder.loading = false
				state.dataAllOrder.data = action.payload
			})
			.addCase(fetchAllOrderByUser.rejected, (state, action) => {
				state.dataAllOrder.loading = false
				state.dataAllOrder.error = action.error.message || ''
			})
			.addCase(fetchAllOrderByNumberTableAndLocationUser.pending, (state) => {
				state.dataOrderByNumberTable.loading = true
			})
			.addCase(fetchAllOrderByNumberTableAndLocationUser.fulfilled, (state, action) => {
				state.dataOrderByNumberTable.loading = false
				state.dataOrderByNumberTable.data = action.payload
			})
			.addCase(fetchAllOrderByNumberTableAndLocationUser.rejected, (state, action) => {
				state.dataOrderByNumberTable.loading = false
				state.dataOrderByNumberTable.error = action.error.message || ''
			})
			.addCase(fetchAllOrder.pending, (state) => {
				state.dataAllOrder.loading = true
			})
			.addCase(fetchAllOrder.fulfilled, (state, action) => {
				state.dataAllOrder.loading = false
				state.dataAllOrder.data = action.payload
			})
			.addCase(fetchAllOrder.rejected, (state, action) => {
				state.dataAllOrder.loading = false
				state.dataAllOrder.error = action.error.message || ''
			})
			.addCase(fetchAllOrderByUserRole.pending, (state) => {
				state.dataAllOrderAdmin.loading = true
			})
			.addCase(fetchAllOrderByUserRole.fulfilled, (state, action) => {
				state.dataAllOrderAdmin.loading = false
				state.dataAllOrderAdmin.data = action.payload
			})
			.addCase(fetchAllOrderByUserRole.rejected, (state, action) => {
				state.dataAllOrderAdmin.loading = false
				state.dataAllOrderAdmin.error = action.error.message || ''
			})
	},
})

const { reducer, actions } = orderSlice

export const { setOrder, setOrderByNumberTable, setIdNotiConfirm, setAllOrder, setAllOrderAdmin } =
	actions

export default reducer
