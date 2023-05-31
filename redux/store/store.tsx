import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlice from '../componentSlice/userSlice'
import messageSocketSlice from '../componentSlice/messageSocketSlice'

const rootReducer = combineReducers({
	user: userSlice,
	message: messageSocketSlice,
	// login: loginSlice,
})

export default configureStore({
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
	reducer: rootReducer,
})
