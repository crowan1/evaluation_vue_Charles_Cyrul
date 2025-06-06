<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>🔽 Liste des clients</h5>
      <router-link to="/clients/new" class="btn btn-primary btn-sm">
        ➕ Ajouter un client
      </router-link>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead class="table-light">
        <tr>
          <th>Nom</th>
          <th>Entreprise</th>
          <th>Date d'ajout</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="client in clients" :key="client.id">
          <td>
            <span class="text-muted">👤</span> {{ client.nom }}
          </td>
          <td>{{ client.nom }}</td>
          <td>{{ formatDate(client.dateCreation) }}</td>
          <td>
            <button @click="deleteClient(client)" class="btn btn-outline-danger btn-sm me-2">
              ️ supprimer
            </button>
            <router-link :to="`/clients/${client.id}/edit`" class="btn btn-outline-primary btn-sm">
               éditer
            </router-link>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useStore } from '../store.js'
import { onMounted, computed } from 'vue'

export default {
  setup() {
    const store = useStore()

    const clients = computed(() => store.clients)

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const deleteClient = async (client) => {
      if (confirm(`Supprimer ${client.nom} ?`)) {
        await store.deleteClient(client.id)
      }
    }

    onMounted(() => {
      store.getClients()
    })

    return {
      clients,
      formatDate,
      deleteClient
    }
  }
}
</script>