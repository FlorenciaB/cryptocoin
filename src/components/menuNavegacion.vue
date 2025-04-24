<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top px-3 py-2">
    <a class="navbar-brand" href="#">CRYPTOCOIN</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/pantallaPrincipal">Cotizador</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/formularioCompra">Compra</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/formularioVenta">Venta</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/historialMovimientos">Mis movimientos</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/billeteraVirtual">Billetera</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>

export default {
  name: 'menuNavegacion',
};
</script>

<style scoped>
.navbar {
  background-color: #f8f9fa;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.navbar-brand {
  font-weight: bold;
  color: #007bff;
}

.navbar-nav .nav-link {
  color: #495057;
}

.navbar-nav .nav-link.active {
  color: #007bff;
  font-weight: bold;
}

.navbar-nav .nav-link:hover {
  color: #0056b3;
}

.navbar-toggler {
  border: none;
}
</style>