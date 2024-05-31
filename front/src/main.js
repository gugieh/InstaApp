// import './assets/main.css'
import './assets/css.css'

import { createApp } from 'vue'

// import App from './App01.vue' // aplikacja
// import store from "./store/index01" // --- załączamy store z osobnego pliku ---

// import App from './App02.vue' // aplikacja
// import store from "./store/index02" // --- załączamy store z osobnego pliku ---

import App from './App03.vue' // aplikacja
import store from "./store/index" // --- załączamy store z osobnego pliku ---

import router from './router/router' // --- załączamy router z osobnego pliku ---

createApp(App).use(store).use(router).mount('#app')


