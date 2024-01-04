import '@/styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
// import { store, persistor } from '';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import MasterLayout from '@/components/masterLayout/masterLayout'
// import PrivateRoute from '@/components/common/privateRoute'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@/redux/store/store'
import { ReactElement, ReactNode, useState } from 'react'
import MenuItem from '@/components/jsonData/menuItem'
import { NextPage } from 'next'
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.Layout || ((page) => page)

	const MyMenu = ({ data }) => (
		<div>
			{data.map((item) => (
				<MenuItem key={item.key} title={item.title} icon={item.icon} link={item.link}>
					{item.children && <MyMenu data={item.children} />}
				</MenuItem>
			))}
		</div>
	)

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ToastContainer />
				{getLayout(<Component {...pageProps} />)}
			</PersistGate>
		</Provider>
	)
}
