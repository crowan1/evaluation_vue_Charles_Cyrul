import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FacturesList from '../views/FacturesList.vue'
import FactureEdit from '../views/FactureEdit.vue'
import ClientsList from '../views/ClientsList.vue'
import ClientEdit from '../views/ClientEdit.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/factures',
        name: 'FacturesList',
        component: FacturesList
    },
    {
        path: '/factures/new',
        name: 'FactureNew',
        component: FactureEdit
    },
    {
        path: '/factures/:id/edit',
        name: 'FactureEdit',
        component: FactureEdit,
        props: true
    },
    {
        path: '/clients',
        name: 'ClientsList',
        component: ClientsList
    },
    {
        path: '/clients/new',
        name: 'ClientNew',
        component: ClientEdit
    },
    {
        path: '/clients/:id/edit',
        name: 'ClientEdit',
        component: ClientEdit,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router