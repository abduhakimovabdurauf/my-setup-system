import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useMainStore } from './store'

// CSS va fontlar
import '@fortawesome/fontawesome-free/css/all.css'
import './assets/styles.css'
import './assets/tailwind.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Store init – localStorage ma’lumotlarini birinchi yuklash
const store = useMainStore()
store.init()

app.mount('#app')
