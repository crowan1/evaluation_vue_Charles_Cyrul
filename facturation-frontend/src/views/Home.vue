<template>
  <div>

    <div class="text-center mb-4">
      <router-link to="/clients/new" class="btn btn-primary me-3">
        ➕ Ajouter un client
      </router-link>
      <router-link to="/factures/new" class="btn btn-success">
        ➕ Ajouter une facture
      </router-link>
    </div>

    <div class="card mb-4">
      <div class="card-header">
        <h5>Factures en cours</h5>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>N°</th>
            <th>Client</th>
            <th>Montant HT</th>
            <th>Montant TTC</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="facture in factures.slice(0, 5)" :key="facture.id">
            <td>📄 {{ facture.numero }}</td>
            <td>{{ getClientName(facture.clientId) }}</td>
            <td>{{ facture.montantHT }} € HT</td>
            <td>{{ facture.montantTTC }} € TTC</td>
            <td>
              <router-link :to="`/factures/${facture.id}/edit`" class="btn btn-sm btn-outline-primary">
                Éditer
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h5>Clients</h5>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>Nom du client</th>
            <th>Entreprise</th>
            <th>Date d'ajout</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="client in clients.slice(0, 5)" :key="client.id">
            <td>👤 {{ client.nom }}</td>
            <td>{{ client.nom }}</td>
            <td>{{ formatDate(client.dateCreation) }}</td>
            <td>
              <router-link :to="`/clients/${client.id}/edit`" class="btn btn-sm btn-outline-primary">
                Éditer
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
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
    const factures = computed(() => store.factures)

    const getClientName = (clientId) => {
      const client = store.clients.find(c => c.id === clientId)
      return client ? client.nom : 'Client inconnu'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    onMounted(() => {
      store.getClients()
      store.getFactures()
    })

    return {
      clients,
      factures,
      getClientName,
      formatDate
    }
  }
}
</script>