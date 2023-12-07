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
import { useState } from 'react'
import MenuItem from '@/components/jsonData/menuItem'
import { itemsAdmin, itemsEmployee, itemsOrder } from '@/components/jsonData/menuData'

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const isAdminPage = router.pathname.startsWith('/admin')
	const isEmployeePage = router.pathname.startsWith('/employee')
	const isOrderPage = router.pathname.startsWith('/order')
	const [selectedItemKey, setSelectedItemKey] = useState(null)

	const handleMenuClick = (item) => {
		if (item) {
			sessionStorage.setItem('clickItemChecked', item.key)
		}
	}

	const MyMenu = ({ data }) => (
		<div>
			{data.map((item) => (
				<MenuItem key={item.key} title={item.title} icon={item.icon} link={item.link}>
					{item.children && <MyMenu data={item.children} />}
				</MenuItem>
			))}
		</div>
	)
	const renderPage = () => {
		if (isAdminPage) {
			return (
				// <PrivateRoute>
				<MasterLayout
					itemsSiderBar={itemsAdmin}
					isPage="admin"
					selectedItemKey={selectedItemKey}
					handleMenuClick={handleMenuClick}
				>
					<Component {...pageProps} />
				</MasterLayout>
				// </PrivateRoute>
			)
		} else if (isEmployeePage) {
			return (
				// <PrivateRoute>
				<MasterLayout
					itemsSiderBar={itemsEmployee}
					isPage="employee"
					selectedItemKey={selectedItemKey}
					handleMenuClick={handleMenuClick}
				>
					<Component {...pageProps} />
				</MasterLayout>
				// </PrivateRoute>
			)
		} else if (isOrderPage) {
			return (
				<MasterLayout
					itemsSiderBar={itemsOrder}
					isPage="order"
					selectedItemKey={selectedItemKey}
					handleMenuClick={handleMenuClick}
				>
					<Component {...pageProps} />
				</MasterLayout>
			)
		}
		return <Component {...pageProps} />
	}

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ToastContainer />
				{renderPage()}
			</PersistGate>
		</Provider>
	)
}
