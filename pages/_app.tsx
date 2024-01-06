import '@/styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@/redux/store/store'
import { ReactElement, ReactNode, useEffect } from 'react'
import MenuItem from '@/components/jsonData/menuItem'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import PrivateRoute from '@/components/common/privateRoute'
import MasterLayout from '@/components/masterLayout/masterLayout'
import { getRole } from '@/utils/accessRoles'
import { CHECK_TYPE_INPUT } from '@/constanst/constanst.const'
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const router = useRouter()
	const handleRoles = getRole(router.pathname)
	const checkPage =
		router.pathname && CHECK_TYPE_INPUT.some((item) => router.pathname.includes(item))

	const MyMenu = ({ data }) => (
		<div>
			{data.map((item) => (
				<MenuItem key={item.key} title={item.title} icon={item.icon} link={item.link}>
					{item.children && <MyMenu data={item.children} />}
				</MenuItem>
			))}
		</div>
	)
	const renderComponent = () => {
		return (
			<>
				{checkPage ? (
					<PrivateRoute allowedRoles={handleRoles}>
						<MasterLayout rolesAccess={handleRoles}>
							<Component {...pageProps} />
						</MasterLayout>
					</PrivateRoute>
				) : handleRoles.includes('order') ? (
					<MasterLayout rolesAccess={handleRoles}>
						<Component {...pageProps} />
					</MasterLayout>
				) : (
					<Component {...pageProps} />
				)}
			</>
		)
	}

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ToastContainer />
				{renderComponent()}
			</PersistGate>
		</Provider>
	)
}
