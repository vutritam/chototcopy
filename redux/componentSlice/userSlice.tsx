import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { asyncGetList, asyncWrapper } from '../../helper/asyncHelper'
import axiosConfig from '../../pages/api/axiosConfigs'

export const fetchCreatePost = createAsyncThunk<any, string>(
	'api/fetchCreatePost',
	async (options) => {
		let response = await axiosConfig.post('/auth/login', options)
		return response.data
	}
)

export const fetchUserById = createAsyncThunk<any, string>('api/fetchUserById', async (options) => {
	let response = await axiosConfig.post(`/users/${options}`)
	return response.data
})

export const fetchRegisterUser = createAsyncThunk<any, string>(
	'api/fetchRegisterUser',
	async (options) => {
		let response = await axiosConfig.post('/users/add', options)
		return response.data
	}
)

export const fetchAllUser = createAsyncThunk<any, string>('api/fetchAllUser', async () => {
	let response = await axiosConfig.get('/users')
	return response.data
})

const userSlice = createSlice({
	name: 'user',
	initialState: {
		account: { user: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
		dataList: { dataItem: null, loading: false, error: '' }, // 0: options 0 trong menu dropdown client, 1: ...
		allUser: { data: null, loading: false, error: '' },
	},
	reducers: {
		setUser: (state, action) => {
			state.account.user = action.payload
		},
		setAllUser: (state, action) => {
			state.allUser.data = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCreatePost.pending, (state) => {
				state.account.loading = true
			})
			.addCase(fetchCreatePost.fulfilled, (state, action) => {
				state.account.loading = false
				state.account.user = action.payload
			})
			.addCase(fetchCreatePost.rejected, (state, action) => {
				state.account.loading = false
				state.account.error = action.error.message || ''
			})
			// get user by id
			.addCase(fetchUserById.pending, (state) => {
				state.account.loading = true
			})
			.addCase(fetchUserById.fulfilled, (state, action) => {
				state.account.loading = false
				state.account.user = action.payload
			})
			.addCase(fetchUserById.rejected, (state, action) => {
				state.account.loading = false
				state.account.error = action.error.message || ''
			})
			/// ------ trigger when user register ----------
			.addCase(fetchRegisterUser.pending, (state) => {
				state.account.loading = true
			})
			.addCase(fetchRegisterUser.fulfilled, (state, action) => {
				state.account.loading = false
			})
			.addCase(fetchRegisterUser.rejected, (state, action) => {
				state.account.loading = false
				state.account.error = action.error.message || ''
			})
			/// ------ trigger when get all user ----------
			.addCase(fetchAllUser.pending, (state) => {
				state.allUser.loading = true
			})
			.addCase(fetchAllUser.fulfilled, (state, action) => {
				state.allUser.loading = false
				state.allUser.data = action.payload
			})
			.addCase(fetchAllUser.rejected, (state, action) => {
				state.allUser.loading = false
				state.allUser.error = action.error.message || ''
			})
	},
})

const { reducer, actions } = userSlice

export const { setUser, setAllUser } = actions

export default reducer
