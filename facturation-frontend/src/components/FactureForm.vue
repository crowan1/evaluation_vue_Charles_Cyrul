<template>
  <form @submit.prevent="submitForm">
    <div class="mb-3">
      <label for="client" class="form-label">Client</label>
      <input id="client" v-model="localFacture.client" type="text" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="montant" class="form-label">Montant (€)</label>
      <input id="montant" v-model.number="localFacture.montant" type="number" min="0" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="date" class="form-label">Date</label>
      <input id="date" v-model="localFacture.date" type="date" class="form-control" required />
    </div>

    <button type="submit" class="btn btn-primary">Enregistrer</button>
  </form>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  facture: Object,
});

const emits = defineEmits(['save']);

const localFacture = ref({ ...props.facture });

watch(() => props.facture, (newVal) => {
  localFacture.value = { ...newVal };
});

function submitForm() {
  emits('save', localFacture.value);
}
</script>
