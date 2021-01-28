import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD56wv3ZvTzPbzL9sSObjPqCoo7lHWsQ2g",
  authDomain: "agatha-christie-a4077.firebaseapp.com",
  databaseURL: "https://agatha-christie-a4077-default-rtdb.firebaseio.com",
  projectId: "agatha-christie-a4077",
  storageBucket: "agatha-christie-a4077.appspot.com",
  messagingSenderId: "57489942707",
  appId: "1:57489942707:web:f694d47dc62c4a0f4aa8c6",
  measurementId: "G-WSQ6VKMWX1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
