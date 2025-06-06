<template>
  <div>
    <!-- Navigation simple -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div class="container">
        <span class="navbar-brand">Factures</span>
        <div class="navbar-nav">
          <router-link to="/" class="nav-link">Accueil</router-link>
          <router-link to="/factures" class="nav-link"> Factures</router-link>
          <router-link to="/clients" class="nav-link"> Clients</router-link>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>