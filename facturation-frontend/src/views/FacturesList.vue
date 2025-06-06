<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Factures</h4>
      <router-link to="/factures/new" class="btn btn-secondary">
        ➕ Ajouter une facture
      </router-link>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-else class="card">
      <div class="card-header">
        <h5>Liste des Factures</h5>
      </div>
      <div class="card-body">
        <div v-if="factures.length === 0" class="text-center text-muted">
          Aucune facture trouvée
        </div>
        <table v-else class="table table-striped">
          <thead class="table-light">
          <tr>
            <th>N°</th>
            <th>Client</th>
            <th>Date émission</th>
            <th>Date échéance</th>
            <th>Montant TTC</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="facture in factures" :key="facture.id">
            <td>{{ facture.numero }}</td>
            <td>{{ getClientName(facture.clientId) }}</td>
            <td>{{ formatDate(facture.dateEmission) }}</td>
            <td>{{ formatDate(facture.dateEcheance) }}</td>
            <td><strong>{{ facture.montantTTC }}€</strong></td>
            <td>
              <button @click="editFacture(facture)" class="btn btn-secondary btn-sm me-2">
                Éditer
              </button>
              <button @click="deleteFacture(facture)" class="btn btn-danger btn-sm">
                Supprimer
              </button>
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
import { onMounted, computed, ref } from 'vue'

export default {
  setup() {
    const store = useStore()
    const loading = ref(true)

    const factures = computed(() => store.factures)
    const clients = computed(() => store.clients)

    const getClientName = (clientId) => {
      const client = store.clients.find(c => c.id === clientId)
      return client ? client.nom : 'Client inconnu'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const editFacture = (facture) => {
      // Rediriger vers la page d'édition
      window.location.href = `/factures/${facture.id}/edit`
    }

    const deleteFacture = async (facture) => {
      if (confirm(`Supprimer la facture ${facture.numero} ?`)) {
        try {
          await store.deleteFacture(facture.id)
        } catch (error) {
          alert('Erreur lors de la suppression')
        }
      }
    }

    onMounted(async () => {
      try {
        await store.getClients()
        await store.getFactures()
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        loading.value = false
      }
    })

    return {
      factures,
      clients,
      loading,
      getClientName,
      formatDate,
      editFacture,
      deleteFacture
    }
  }
}
</script>