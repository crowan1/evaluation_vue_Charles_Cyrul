<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h5>🔽 {{ isEdit ? 'Éditer' : 'Nouvelle' }} facture</h5>
      <div>
        <button v-if="isEdit" @click="deleteFacture" class="btn btn-outline-danger me-2">
          🗑️ supprimer
        </button>
        <router-link to="/factures" class="btn btn-outline-secondary">
          ↩️ Retour
        </router-link>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label">Facture N°:</label>
            <input v-model="form.numero" type="text" class="form-control" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Description:</label>
            <input v-model="form.description" type="text" class="form-control" placeholder="Description">
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-md-6">
            <label class="form-label">Émise le:</label>
            <input v-model="form.dateEmission" type="date" class="form-control" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Client:</label>
            <select v-model="form.clientId" class="form-select" required>
              <option value="">Sélectionner un client</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.nom }}
              </option>
            </select>
          </div>
        </div>

        <div class="table-responsive mb-4">
          <table class="table table-bordered">
            <thead class="table-light">
            <tr>
              <th style="width: 8%">Actions</th>
              <th style="width: 42%">Prestation</th>
              <th style="width: 15%">Quantité</th>
              <th style="width: 15%">Montant unitaire</th>
              <th style="width: 20%">Montant total</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(prestation, index) in prestations" :key="'prestation-' + index">
              <td class="text-center">
                <button type="button" @click="ajouterPrestation" class="btn btn-success btn-sm me-1">
                  ➕
                </button>
                <button type="button" @click="supprimerPrestation(index)" class="btn btn-danger btn-sm">
                  🗑️
                </button>
              </td>
              <td>
                <input
                    v-model="prestation.designation"
                    type="text"
                    class="form-control"
                    placeholder="Ex: Étude graphique UX">
              </td>
              <td>
                <input
                    v-model.number="prestation.quantite"
                    type="number"
                    class="form-control text-center"
                    min="1"
                    @input="calculerMontantLigne(index)">
              </td>
              <td>
                <input
                    v-model.number="prestation.prixUnitaire"
                    type="number"
                    step="0.01"
                    class="form-control text-end"
                    @input="calculerMontantLigne(index)">
              </td>
              <td>
                <input
                    :value="formatMontant(prestation.montant || 0)"
                    type="text"
                    class="form-control text-end fw-bold"
                    readonly>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="row">
          <div class="col-md-8"></div>
          <div class="col-md-4">
            <table class="table table-sm mb-4">
              <tbody>
              <tr>
                <td>Remises</td>
                <td class="text-end">0,00 €</td>
              </tr>
              <tr>
                <td>Déjà payé</td>
                <td class="text-end">0,00 €</td>
              </tr>
              <tr class="table-light">
                <td><strong>Total HT</strong></td>
                <td class="text-end"><strong>{{ formatMontant(totalHT) }}</strong></td>
              </tr>
              <tr>
                <td>TVA (20%)</td>
                <td class="text-end">{{ formatMontant(totalTVA) }}</td>
              </tr>
              <tr class="table-dark text-white">
                <td><strong>Montant TTC</strong></td>
                <td class="text-end"><strong>{{ formatMontant(totalTTC) }}</strong></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="text-end">
          <button @click="sauvegarder" class="btn btn-primary btn-lg">
            💾 Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store.js'

export default {
  props: ['id'],
  setup(props) {
    const router = useRouter()
    const store = useStore()

    const isEdit = !!props.id
    const clients = computed(() => store.clients)

    const form = ref({
      numero: '',
      description: '',
      clientId: '',
      dateEmission: new Date().toISOString().split('T')[0],
      notes: ''
    })

    const prestations = ref([])

    const totalHT = computed(() => {
      return prestations.value.reduce((total, p) => total + (p.montant || 0), 0)
    })

    const totalTVA = computed(() => totalHT.value * 0.20)
    const totalTTC = computed(() => totalHT.value + totalTVA.value)

    const formatMontant = (montant) => {
      return (montant || 0).toFixed(2) + ' €'
    }

    const ajouterPrestation = () => {
      prestations.value.push({
        id: 'a' + Date.now(),
        designation: '',
        quantite: 1,
        prixUnitaire: 0,
        montant: 0
      })
    }

    const supprimerPrestation = (index) => {
      if (prestations.value.length > 1) {
        prestations.value.splice(index, 1)
      }
    }

    const calculerMontantLigne = (index) => {
      const p = prestations.value[index]
      p.montant = (p.quantite || 0) * (p.prixUnitaire || 0)
    }

    const sauvegarder = async () => {
      try {
        // VALIDATION
        if (!form.value.numero || !form.value.clientId || !form.value.dateEmission) {
          alert('Remplissez tous les champs obligatoires')
          return
        }

        if (prestations.value.length === 0) {
          alert('Ajoutez au moins une prestation')
          return
        }

        for (let p of prestations.value) {
          if (!p.designation || !p.quantite || !p.prixUnitaire) {
            alert('Remplissez toutes les prestations')
            return
          }
        }

        const dateEcheance = new Date(form.value.dateEmission)
        dateEcheance.setDate(dateEcheance.getDate() + 30)

        const factureData = {
          ...form.value,
          dateEcheance: dateEcheance.toISOString().split('T')[0],
          articles: prestations.value,
          montantHT: totalHT.value,
          tva: totalTVA.value,
          montantTTC: totalTTC.value,
          statut: 'en_attente'
        }

        if (isEdit) {
          await store.updateFacture(props.id, factureData)
        } else {
          await store.createFacture(factureData)
        }

        router.push('/factures')

      } catch (error) {
        alert('Erreur: ' + error.message)
      }
    }

    const deleteFacture = async () => {
      if (confirm('Supprimer cette facture ?')) {
        await store.deleteFacture(props.id)
        router.push('/factures')
      }
    }

    const chargerFacture = async () => {
      if (isEdit) {
        await store.getFactures()
        const facture = store.factures.find(f => f.id === props.id)

        if (facture) {
          form.value.numero = facture.numero
          form.value.description = facture.description || ''
          form.value.clientId = facture.clientId
          form.value.dateEmission = facture.dateEmission
          form.value.notes = facture.notes || ''

          prestations.value = [...(facture.articles || [])]

          if (prestations.value.length === 0) {
            ajouterPrestation()
          }

        } else {
          alert('Facture non trouvée')
          router.push('/factures')
        }
      } else {
        form.value.numero = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
        ajouterPrestation()
      }
    }

    // INIT
    onMounted(async () => {
      try {
        await store.getClients()
        await chargerFacture()
      } catch (error) {
        alert('Erreur: ' + error.message)
      }
    })

    return {
      isEdit,
      clients,
      form,
      prestations,
      totalHT,
      totalTVA,
      totalTTC,
      formatMontant,
      ajouterPrestation,
      supprimerPrestation,
      calculerMontantLigne,
      sauvegarder,
      deleteFacture
    }
  }
}
</script>