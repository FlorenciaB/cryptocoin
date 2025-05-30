<template>
  <nav>
    <menuNavegacion />
  </nav>

  <div class="container mt-4">
    <h2>Estado Actual de las Finanzas</h2>

    <!-- Mostrar el spinner mientras se están cargando los datos -->
    <LoadingSpinner v-if="loading" />

    <!-- Mostrar la tabla cuando se hayan cargado los datos -->
    <div v-else class="finanzas-table-container">
      <div class="finanzas-table">
        <div class="header">Criptomoneda</div>
        <div class="header">Cantidad</div>
        <div class="header">Monto (ARS)</div>

        <!-- Mostrar cada criptomoneda con su saldo actual y monto en ARS -->
        <div v-for="(crypto, code) in saldoFiltrado" :key="code" class="row">
          <div class="cell">{{ mapCryptoCode(code) }}</div>
          <div class="cell">{{ crypto.cantidad.toFixed(8) }}</div>
          <div class="cell">{{ crypto.montoARS.toFixed(2) }}</div>
        </div>

        <div class="total">
          <h3>Total en ARS</h3>
          <p>{{ montoTotalARS.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import menuNavegacion from '@/components/menuNavegacion.vue';
import { apiClient, apiCriptoya } from "@/axios";
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'estadoFinanzas',

  components: {
    menuNavegacion,
    LoadingSpinner
  },

  data() {
    return {
      movimientos: [],
      saldoActual: {},
      montoTotalARS: 0,
      precios: {}, // Para almacenar los precios de las criptomonedas
      loading: true, // Activamos el loading al inicio
    };
  },

  computed: {
    saldoFiltrado() {
      const saldoFiltrado = {};
      for (const [code, crypto] of Object.entries(this.saldoActual)) {
        if (crypto.cantidad > 0) {
          saldoFiltrado[code] = crypto;
        }
      }
      return saldoFiltrado;
    }
  },

  methods: {
    mapCryptoCode(crypto_code) {
      const mapping = {
        'BTC': 'Bitcoin (BTC)',
        'ETH': 'Ethereum (ETH)',
        'LTC': 'Litecoin (LTC)'
      };
      return mapping[crypto_code] || crypto_code;
    },

    async obtenerPrecios() {
      try {
        const cryptos = ['BTC', 'ETH', 'LTC'];
        const precios = {};

        for (const crypto of cryptos) {
          const response = await apiCriptoya.get(`/binance/${crypto}/ARS/1`);
          precios[crypto] = response.data.ask;
        }

        this.precios = precios;
      } catch (error) {
        console.error('Error al obtener precios:', error);
      }
    },

    async calcularSaldo() {
      await this.obtenerPrecios();
      const saldo = {};
      let montoTotal = 0;

      this.movimientos.forEach(movimiento => {
        const code = movimiento.crypto_code.toUpperCase();
        if (!saldo[code]) {
          saldo[code] = { cantidad: 0, montoARS: 0 };
        }

        if (movimiento.action === 'purchase') {
          saldo[code].cantidad += parseFloat(movimiento.crypto_amount);
        } else if (movimiento.action === 'sale') {
          const cantidad = parseFloat(movimiento.crypto_amount);
          saldo[code].cantidad = Math.max(saldo[code].cantidad - cantidad, 0);
        }
      });

      for (const [code, crypto] of Object.entries(saldo)) {
        if (this.precios[code]) {
          crypto.montoARS = crypto.cantidad * this.precios[code];
        } else {
          crypto.montoARS = 0;
        }
        montoTotal += crypto.montoARS;
      }

      this.saldoActual = saldo;
      this.montoTotalARS = montoTotal;
    }
  },

  async created() {
    try {
      const userId = localStorage.getItem('user');
      const response = await apiClient.get('/transactions');
      this.movimientos = response.data.filter(movimiento => movimiento.user_id === userId);

      await this.calcularSaldo();
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
      alert('Error al obtener los movimientos. Por favor, inténtelo de nuevo.');
    } finally {
      // Después de cargar los datos, desactivamos el spinner
      this.loading = false;
    }
  }
}
</script>

  
  <style scoped>
  /* Estilos para la tabla de visualización del saldo */
  .finanzas-table {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .header {
    font-weight: bold;
    text-align: center;
    background-color: #e9ecef;
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
  }
  
  .row {
    display: contents; /* Permite que los elementos se muestren como si fueran parte de la cuadrícula */
  }
  
  .cell {
    text-align: center;
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
  }
  
  .total {
    grid-column: span 3;
    margin-top: 1rem;
    text-align: right;
    font-weight: bold;
  }

  
  </style>