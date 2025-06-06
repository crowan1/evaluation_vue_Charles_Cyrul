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

    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4" style="height: 400px;">
          <div class="card-body d-flex flex-column">
            <div class="row mb-3">
              <div class="col-6 text-center">
                <h2 class="text-primary mb-0">{{ totalFactures }}</h2>
                <small class="text-muted">Factures en {{ currentYear }}</small>
              </div>
              <div class="col-6 text-center">
                <h4 class="text-success mb-0">{{ formatCurrency(totalMontant) }}</h4>
                <small class="text-muted">Total TTC</small>
              </div>
            </div>

            <div class="flex-grow-1">
              <v-chart
                  class="chart"
                  :option="chartOption"
                  style="height: 250px;"
                  autoresize />
            </div>

            <div class="row mt-3 text-center">
              <div class="col-4">
                <span class="badge" style="background-color: #5470C6;">●</span>
                <small>Payées</small><br>
                <strong>{{ formatCurrency(montantPayees) }}</strong>
              </div>
              <div class="col-4">
                <span class="badge" style="background-color: #91CC75;">●</span>
                <small>En Attente</small><br>
                <strong>{{ formatCurrency(montantEnAttente) }}</strong>
              </div>
              <div class="col-4">
                <span class="badge" style="background-color: #FAC858;">●</span>
                <small>En Retard</small><br>
                <strong>{{ formatCurrency(montantEnRetard) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
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
                <th>Montant TTC</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="facture in factures.slice(0, 5)" :key="facture.id">
                <td>📄 {{ facture.numero }}</td>
                <td>{{ getClientName(facture.clientId) }}</td>
                <td>{{ facture.montantTTC }} €</td>
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
            <h5>Clients récents</h5>
          </div>
          <div class="card-body">
            <table class="table table-striped">
              <thead>
              <tr>
                <th>Nom du client</th>
                <th>Entreprise</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="client in clients.slice(0, 5)" :key="client.id">
                <td>👤 {{ client.nom }}</td>
                <td>{{ client.nom }}</td>
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
    </div>
  </div>
</template>

<script>
import { useStore } from '../store.js'
import { onMounted, computed } from 'vue'
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { PieChart } from "echarts/charts"
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components"
import VChart from "vue-echarts"

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

export default {
  components: {
    VChart
  },
  setup() {
    const store = useStore()

    const clients = computed(() => store.clients)
    const factures = computed(() => store.factures)

    const totalFactures = computed(() => factures.value.length)
    const currentYear = computed(() => new Date().getFullYear())

    const totalMontant = computed(() => {
      return factures.value.reduce((sum, f) => sum + (f.montantTTC || 0), 0)
    })

    const facturesPayees = computed(() => {
      return factures.value.filter(f => f.statut === 'payee')
    })

    const facturesEnAttente = computed(() => {
      return factures.value.filter(f => f.statut === 'en_attente')
    })

    const facturesEnRetard = computed(() => {
      return factures.value.filter(f => f.statut === 'en_retard')
    })

    const montantPayees = computed(() => {
      return facturesPayees.value.reduce((sum, f) => sum + (f.montantTTC || 0), 0)
    })

    const montantEnAttente = computed(() => {
      return facturesEnAttente.value.reduce((sum, f) => sum + (f.montantTTC || 0), 0)
    })

    const montantEnRetard = computed(() => {
      return facturesEnRetard.value.reduce((sum, f) => sum + (f.montantTTC || 0), 0)
    })

    const chartOption = computed(() => ({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}€ ({d}%)'
      },
      series: [
        {
          name: 'Factures',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: montantPayees.value,
              name: 'Factures Payées',
              itemStyle: { color: '#5470C6' }
            },
            {
              value: montantEnAttente.value,
              name: 'En Attente',
              itemStyle: { color: '#91CC75' }
            },
            {
              value: montantEnRetard.value,
              name: 'En Retard',
              itemStyle: { color: '#FAC858' }
            }
          ]
        }
      ]
    }))

    const getClientName = (clientId) => {
      const client = store.clients.find(c => c.id === clientId)
      return client ? client.nom : 'Client inconnu'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount || 0)
    }

    onMounted(() => {
      store.getClients()
      store.getFactures()
    })

    return {
      clients,
      factures,
      totalFactures,
      currentYear,
      totalMontant,
      montantPayees,
      montantEnAttente,
      montantEnRetard,
      chartOption,
      getClientName,
      formatDate,
      formatCurrency
    }
  }
}
</script>