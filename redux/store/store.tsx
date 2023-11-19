import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlice from '../componentSlice/userSlice'
import messageSocketSlice from '../componentSlice/messageSocketSlice'
import orderSlice from '../componentSlice/orderSlice'
import productSlice from '../componentSlice/productSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // sử dụng local storage

const persistConfigDataOrder = {
	key: 'dataOrder',
	storage,
}
const persistConfigUser = {
	key: 'user',
	storage,
}

const rootReducer = combineReducers({
	user: persistReducer(persistConfigUser, userSlice),
	message: messageSocketSlice,
	dataOrder: persistReducer(persistConfigDataOrder, orderSlice),
	products: productSlice,
	// login: loginSlice,
})

export const store = configureStore({
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
	reducer: rootReducer,
})

export const persistor = persistStore(store)
