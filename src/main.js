import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { loadAppConfig } from './composables/useAppConfig'

loadAppConfig().then(() => {
  createApp(App).mount('#app')
})
