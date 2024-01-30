import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { asyncGetList, asyncWrapper } from '../../helper/asyncHelper'
import axiosConfig from '../../pages/api/axiosConfigs'

export const fetchCreateProduct = createAsyncThunk<any, string>(
	'api/fetchCreatePost',
	async (options) => {
		let response = await axiosConfig.post('/products/add', options, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return response.data
	}
)

export const fetchProductById = createAsyncThunk<any, string>(
	'api/fetchProductById',
	async (options) => {
		let response = await axiosConfig.post(`/products/getProductById/${options}`)
		return response.data
	}
)

export const fetchProductByFilterCondition = createAsyncThunk<any, string>(
	'api/fetchProductByFilterCondition',
	async (options) => {
		let response = await axiosConfig.post('/products/filterByCondition', options)
		return response.data
	}
)

export const fetchAllProduct = createAsyncThunk<any, string>('api/fetchAllProduct', async () => {
	let response = await axiosConfig.get('/products')
	return response.data
})

const productSlice = createSlice({
	name: 'products',
	initialState: {
		products: { data: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
	},
	reducers: {
		setProduct: (state, action) => {
			state.products.data = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCreateProduct.pending, (state) => {
				state.products.loading = true
			})
			.addCase(fetchCreateProduct.fulfilled, (state, action) => {
				state.products.loading = false
			})
			.addCase(fetchCreateProduct.rejected, (state, action) => {
				state.products.loading = false
				state.products.error = action.error.message || ''
			})
			.addCase(fetchAllProduct.pending, (state) => {
				state.products.loading = true
			})
			.addCase(fetchAllProduct.fulfilled, (state, action) => {
				state.products.loading = false
				state.products.data = action.payload
			})
			.addCase(fetchAllProduct.rejected, (state, action) => {
				state.products.loading = false
				state.products.error = action.error.message || ''
			})
			.addCase(fetchProductByFilterCondition.pending, (state) => {
				state.products.loading = true
			})
			.addCase(fetchProductByFilterCondition.fulfilled, (state, action) => {
				state.products.loading = false
				state.products.data = action.payload
			})
			.addCase(fetchProductByFilterCondition.rejected, (state, action) => {
				state.products.loading = false
				state.products.error = action.error.message || ''
			})
	},
})

const { reducer, actions } = productSlice

export const { setProduct } = actions

export default reducer
