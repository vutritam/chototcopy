import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlice from '../componentSlice/userSlice'
import messageSocketSlice from '../componentSlice/messageSocketSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // sử dụng local storage

const persistConfig = {
	key: 'message',
	storage,
}

const rootReducer = combineReducers({
	user: userSlice,
	message: persistReducer(persistConfig, messageSocketSlice),
	// login: loginSlice,
})

export const store = configureStore({
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
	reducer: rootReducer,
})

export const persistor = persistStore(store)
