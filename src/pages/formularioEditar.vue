<template>
  <nav>
    <menuNavegacion />
  </nav>

  <div class="container mt-4">
    <h2>Editar Cryptocompra</h2>
    <form @submit.prevent="formularioEditar" class="formularioEditar">
      <div class="mb-3">
        <label for="crypto" class="form-label">Editar Cryptocompra</label>
        <input type="text" class="form-control" id="crypto" v-model="formulario.crypto_code" readonly>
      </div>

      <div class="mb-3">
        <label for="datetime" class="form-label">Fecha y hora de la transacción</label>
        <input type="datetime-local" class="form-control" id="datetime" v-model="formulario.datetime" required>
      </div>

      <div class="mb-3">
        <label for="quantity" class="form-label">Editar cantidad</label>
        <input type="number" class="form-control" id="quantity" v-model.number="formulario.crypto_amount" step="0.00001"
          min="0.00001" required>
        <div class="form-text">Introduce la cantidad de criptomonedas a modificar (número decimal).</div>
      </div>

      <div class="mb-3">
        <label for="amount" class="form-label">Monto Pagado (en Pesos Argentinos)</label>
        <input type="number" class="form-control" id="amount" v-model.number="formulario.money" step="0.01" required>
        <div class="form-text">Monto calculado automáticamente en pesos argentinos.</div>
      </div>

      <div class="mb-3">
        <label for="action" class="form-label">Acción realizada</label>
        <input type="text" class="form-control" id="action" v-model="formulario.action">
      </div>

      <button type="submit" class="btn btn-primary">Registrar edición</button>
    </form>
  </div>
</template>

<script>
import menuNavegacion from '@/components/menuNavegacion.vue';
import { apiCriptoya, apiClient } from "@/axios";

export default {
  name: 'formularioEditar',

  components: {
    menuNavegacion
  },
  
  data() {
    return {
      formulario: {
        _id: "",
        crypto_code: "",
        crypto_amount: "",
        money: "",
        datetime: "",
        action: "",
        tipoCambio: 0
      }
    };
  },

  async created() {
    try {
      const id = this.$route.params.id;
      if (!id) {
        console.error('ID no proporcionado');
        alert('ID no proporcionado');
        return;
      }

      const response = await apiClient.get(`/transactions/${id}`);
      if (response.status === 200) {
        this.formulario = response.data;
        this.formulario.datetime = this.getCurrentDateTime();
        await this.actualizacionPesoArgentino(); // Actualiza el tipo de cambio y realiza el cálculo inicial
      } else {
        console.error('Transacción no encontrada');
        alert('Transacción no encontrada');
      }
    } catch (error) {
      console.error('Error al obtener la transacción:', error);
      alert('Error al obtener la transacción. Por favor, inténtelo de nuevo.');
    }
  },

  methods: {
    getCurrentDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },

    mapCryptoNameToSymbol(name) {
    const mapping = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'litecoin': 'LTC',
    };
    return mapping[name] || name;
  },

    async actualizacionPesoArgentino() {
      try {
        
        let cryptoName = this.formulario.crypto_code;
        let cryptoCode = this.mapCryptoNameToSymbol(cryptoName);

        console.log('cryptoCode en actualizacionPesoArgentino:', cryptoCode); 

        if (!cryptoCode) {
          console.error('CriptoCode no definido');
          return;
        }
        const response = await apiCriptoya.get(`/binance/${cryptoCode}/ARS/1`);

        if (response.status === 200 && response.data) {
          const exchangeRate = response.data.ask;
          if (exchangeRate) {
            this.formulario.tipoCambio = exchangeRate;
            this.calculoTotal();
          } else {
            console.error('API response does not contain the exchange rate');
            alert('No se pudo obtener el tipo de cambio. Verifique la API o la criptomoneda.');
          }
        } else {
          console.error('Error fetching exchange rate:', response.statusText);
          alert('Error al obtener el tipo de cambio. Inténtelo de nuevo.');
        }
      } catch (error) {
        console.error('Error during API call:', error);
        alert('Error al obtener el tipo de cambio. Inténtelo de nuevo.');
      }
    },

    calculoTotal() {
      const amount = this.formulario.crypto_amount;
      const cambio = this.formulario.tipoCambio;
      if (amount && cambio) {
        this.formulario.money = (amount * cambio).toFixed(2);
      }
    },

    async formularioEditar() {
      try {
        const { _id, crypto_amount, datetime, money, action } = this.formulario;
        const response = await apiClient.patch(`/transactions/${_id}`, {
          crypto_amount,
          datetime,
          money,
          action
        });
        if (response.status === 200) {
          alert('Transacción actualizada con éxito');
          this.$router.push('/historialMovimientos');
        } else {
          throw new Error('Error al actualizar la transacción');
        }
      } catch (error) {
        console.error('Error al actualizar la transacción:', error);
        alert('Error al actualizar la transacción. Por favor, inténtelo de nuevo.');
      }
    }
  },
  watch: {
    'formulario.crypto_amount': 'calculoTotal' // Recalcula cuando cambia la cantidad
  }
}
</script>

<style scoped>
/* Estilos para el formulario */
.formularioCompra {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.formularioCompra .form-label {
  font-weight: 600;
}

.formularioCompra .form-control {
  border-radius: 4px;
  box-shadow: none;
}

.formularioCompra .form-select {
  border-radius: 4px;
  box-shadow: none;
}

.formularioCompra .btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.formularioCompra .btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.formularioCompra .form-text {
  font-size: 0.875rem;
  color: #6c757d;
}
</style>