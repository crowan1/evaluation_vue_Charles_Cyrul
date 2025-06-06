<template>
  <div>
    <!-- Header avec boutons supprimer/retour comme image 2 -->
    <div class="d-flex justify-content-between mb-3">
      <h5> Éditer un client</h5>
      <div>
        <button v-if="isEdit" @click="deleteClient" class="btn btn-outline-danger me-2">
           supprimer
        </button>
        <router-link to="/clients" class="btn btn-outline-secondary">
           Retour
        </router-link>
      </div>
    </div>

    <!-- Formulaire exact comme image 2 -->
    <form @submit.prevent="saveClient" class="card">
      <div class="card-body">
        <!-- Section Contact -->
        <h6>Contact:</h6>
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label">Prénom:</label>
            <input v-model="form.prenom" type="text" class="form-control" placeholder="John">
          </div>
          <div class="col-md-4">
            <label class="form-label">Nom:</label>
            <input v-model="form.nom" type="text" class="form-control" placeholder="Doe" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Date d'ajout:</label>
            <input v-model="form.dateCreation" type="date" class="form-control">
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Fonction:</label>
            <input v-model="form.fonction" type="text" class="form-control" placeholder="Directeur">
          </div>
          <div class="col-md-6">
            <label class="form-label">Téléphone:</label>
            <input v-model="form.telephone" type="tel" class="form-control" placeholder="03 87 45 20 13">
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Email:</label>
          <input v-model="form.email" type="email" class="form-control" placeholder="contact@entreprise.com" required>
        </div>

        <div class="mb-4">
          <label class="form-label">Entreprise:</label>
          <input v-model="form.entreprise" type="text" class="form-control" placeholder="Orange">
        </div>

        <!-- Section Coordonnées -->
        <h6>Coordonnées</h6>
        <div class="mb-3">
          <label class="form-label">Adresse 1:</label>
          <input v-model="form.adresse.rue" type="text" class="form-control" placeholder="2 rue de la poupée qui dort">
        </div>

        <div class="mb-3">
          <label class="form-label">Adresse 2:</label>
          <input v-model="form.adresse2" type="text" class="form-control">
        </div>

        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label">Code Postal:</label>
            <input v-model="form.adresse.codePostal" type="text" class="form-control" placeholder="57000">
          </div>
          <div class="col-md-4">
            <label class="form-label">Ville:</label>
            <input v-model="form.adresse.ville" type="text" class="form-control" placeholder="Metz">
          </div>
          <div class="col-md-4">
            <label class="form-label">Pays:</label>
            <select v-model="form.adresse.pays" class="form-select">
              <option>FRANCE</option>
              <option>BELGIQUE</option>
              <option>LUXEMBOURG</option>
            </select>
          </div>
        </div>

        <!-- Bouton Enregistrer comme image 2 -->
        <div class="text-end">
          <button type="submit" class="btn btn-primary">
             Enregistrer
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../store.js'

export default {
  props: ['id'],
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const isEdit = !!props.id

    const form = ref({
      prenom: '',
      nom: '',
      fonction: '',
      telephone: '',
      email: '',
      entreprise: '',
      dateCreation: new Date().toISOString().split('T')[0],
      adresse: {
        rue: '',
        ville: '',
        codePostal: '',
        pays: 'FRANCE'
      },
      adresse2: ''
    })

    const saveClient = async () => {
      try {
        const clientData = {
          nom: form.value.nom,
          email: form.value.email,
          telephone: form.value.telephone,
          siret: '12345678901234', // Valeur par défaut
          adresse: form.value.adresse,
          statut: 'actif',
          dateCreation: form.value.dateCreation
        }

        if (isEdit) {
          await store.updateClient(props.id, clientData)
        } else {
          await store.createClient(clientData)
        }

        router.push('/clients')
      } catch (error) {
        alert('Erreur lors de la sauvegarde')
      }
    }

    const deleteClient = async () => {
      if (confirm('Supprimer ce client ?')) {
        await store.deleteClient(props.id)
        router.push('/clients')
      }
    }

    const loadClient = async () => {
      if (isEdit) {
        await store.getClients()
        const client = store.clients.find(c => c.id === props.id)
        if (client) {
          form.value.nom = client.nom
          form.value.email = client.email
          form.value.telephone = client.telephone
          form.value.dateCreation = client.dateCreation
          form.value.adresse = client.adresse || {}
        }
      }
    }

    onMounted(() => {
      loadClient()
    })

    return {
      form,
      isEdit,
      saveClient,
      deleteClient
    }
  }
}
</script>