<template>
  <nav>
    <menuNavegacion />
  </nav>
    
    <router-view />
    <div class="cotizador-container">
    <h2>Cotizador de Criptomonedas</h2>
    <div class="cotizador-form">
      <div class="form-group">
        <label for="crypto">Criptomoneda</label>
        <select id="crypto" v-model="selectedCrypto" @change="fetchCotizacion">
          <option value="" disabled>Selecciona una criptomoneda</option>
          <option v-for="crypto in criptomonedas" :key="crypto" :value="crypto">{{ crypto }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="currency">Moneda</label>
        <select id="currency" v-model="selectedCurrency" @change="fetchCotizacion">
          <option value="" disabled>Selecciona una moneda</option>
          <option v-for="currency in monedas" :key="currency" :value="currency">{{ currency }}</option>
        </select>
      </div>

      <div class="form-group">
        <button @click="fetchCotizacion">Obtener Cotización</button>
      </div>

      <div v-if="cotizacion" class="cotizacion-result">
        <h3>Precio Actual</h3>
        <p>{{ cotizacion }}</p>
      </div>
    </div>
  </div>
  </template>
  
  <script>
    import menuNavegacion from '@/components/menuNavegacion.vue';
    import { apiCriptoya } from "@/axios";

    export default {
      name: 'pantallaPrincipal',
      components: {
        menuNavegacion,
      },

      data() {
      return {
      criptomonedas: ['BTC', 'ETH', 'LTC'], // Lista de criptomonedas
      monedas: ['ARS', 'USD'], // Lista de monedas fiat
      selectedCrypto: '',
      selectedCurrency: '',
      cotizacion: null
    };
  },

  methods: {
    async fetchCotizacion() {
      if (!this.selectedCrypto || !this.selectedCurrency) {
        return;
      }
      
      try {
        const response = await apiCriptoya.get(`/binance/${this.selectedCrypto}/${this.selectedCurrency}/1`);
        if (response.data) {
          this.cotizacion = `1 ${this.selectedCrypto} = ${response.data.ask} ${this.selectedCurrency}`;
        } else {
          this.cotizacion = 'No se pudo obtener la cotización.';
        }
      } catch (error) {
        console.error('Error al obtener la cotización:', error);
        this.cotizacion = 'Error al obtener la cotización.';
      }
    }
  }
}
</script>

<style scoped>
.cotizador-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.cotizador-container h2 {
  text-align: center;
  margin-bottom: 20px;
}

.cotizador-form .form-group {
  margin-bottom: 15px;
}

.cotizador-form .form-group label {
  display: block;
  margin-bottom: 5px;
}

.cotizador-form .form-group select,
.cotizador-form .form-group button {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.cotizacion-result {
  margin-top: 20px;
  text-align: center;
}

.cotizacion-result h3 {
  margin-bottom: 10px;
}
</style>