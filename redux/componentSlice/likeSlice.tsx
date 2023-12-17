import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosConfig from '../../pages/api/axiosConfigs'

export const fetchAllLikeAndDisLike = createAsyncThunk<any, any, any>(
	'api/fetchAllLikeAndDisLike',
	async () => {
		let response = await axiosConfig.get('/like/getAllLikeAndDisLikeProduct')
		return response.data
	}
)

export const createLikeAndDisLike = createAsyncThunk<any, any, any>(
	'api/fetchAllLikeAndDisLike',
	async (options) => {
		let response = await axiosConfig.post(`/like/createLikeOrDisLikeProduct`, options)
		return response.data
	}
)

const likeSlice = createSlice({
	name: 'like',
	initialState: {
		like: { data: null, loading: false, error: '' },
		disLike: { data: null, loading: false, error: '' },
	},
	reducers: {
		setLike: (state, action) => {
			state.like.data = action.payload
		},
		setDisLike: (state, action) => {
			state.disLike.data = action.payload
		},
	},
})

const { reducer, actions } = likeSlice

export const { setDisLike, setLike } = actions

export default reducer
