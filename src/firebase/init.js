import firebase from 'firebase'
import firestore from 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyAcmaUCiS7zzZhhErLZfdxsTJZAgF0EeSE",
  authDomain: "matchmaker-6a8f3.firebaseapp.com",
  databaseURL: "https://matchmaker-6a8f3.firebaseio.com",
  projectId: "matchmaker-6a8f3",
  storageBucket: "matchmaker-6a8f3.appspot.com",
  messagingSenderId: "673880830914",
  appId: "1:673880830914:web:5325c240649c70fa6a1c5b",
  measurementId: "G-LZNZBD8EG3"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebaseApp.firestore()