import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import ClientsList from './views/ClientsList.vue'
import ClientEdit from './views/ClientEdit.vue'
import FacturesList from './views/FacturesList.vue'
import FactureEdit from './views/FactureEdit.vue'

import 'bootstrap/dist/css/bootstrap.min.css'

const routes = [
    { path: '/', component: Home },
    { path: '/clients', component: ClientsList },
    { path: '/clients/new', component: ClientEdit },
    { path: '/clients/:id/edit', component: ClientEdit, props: true },
    { path: '/factures', component: FacturesList },
    { path: '/factures/new', component: FactureEdit },
    { path: '/factures/:id/edit', component: FactureEdit, props: true }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')