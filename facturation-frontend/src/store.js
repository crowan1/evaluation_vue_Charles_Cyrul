import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
})

export const useStore = defineStore('main', {
    state: () => ({
        clients: [],
        factures: []
    }),

    actions: {
        async getClients() {
            const response = await api.get('/clients')
            this.clients = response.data
        },

        async createClient(client) {
            const response = await api.post('/clients', client)
            this.clients.push(response.data)
            return response.data
        },

        async updateClient(id, client) {
            const response = await api.put(`/clients/${id}`, client)
            const index = this.clients.findIndex(c => c.id === id)
            if (index !== -1) {
                this.clients[index] = response.data
            }
            return response.data
        },

        async deleteClient(id) {
            await api.delete(`/clients/${id}`)
            this.clients = this.clients.filter(c => c.id !== id)
        },

        // FACTURES
        async getFactures() {
            const response = await api.get('/factures')
            this.factures = response.data
        },

        async createFacture(facture) {
            const response = await api.post('/factures', facture)
            this.factures.push(response.data)
            return response.data
        },

        async updateFacture(id, facture) {
            const response = await api.put(`/factures/${id}`, facture)
            const index = this.factures.findIndex(f => f.id === id)
            if (index !== -1) {
                this.factures[index] = response.data
            }
            return response.data
        },

        async deleteFacture(id) {
            await api.delete(`/factures/${id}`)
            this.factures = this.factures.filter(f => f.id !== id)
        }
    }
})