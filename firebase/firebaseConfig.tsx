// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDeUfQAo1vy8jk7ctLklag4maLHPA5Ts04',
	authDomain: 'gold-project-340da.firebaseapp.com',
	projectId: 'gold-project-340da',
	storageBucket: 'gold-project-340da.appspot.com',
	messagingSenderId: '659430648288',
	appId: '1:659430648288:web:9bc30dc637a9d348f3e385',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export { imgDB, txtDB }
