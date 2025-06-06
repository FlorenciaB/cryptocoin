<template>
    <nav>
      <menuNavegacion />
    </nav>
  
    <div class="container mt-4">
      <h2>Registro de Compra de Criptomonedas</h2>
      <form @submit.prevent="formularioCompra" class="formularioCompra">
        <div class="mb-3">
          <label for="crypto" class="form-label">Criptomoneda Comprada</label>
          <select class="form-select" id="crypto" v-model="formulario.crypto_code" @change="actualizacionPesoArgentino" required>
            <option value="" disabled>Selecciona una criptomoneda</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="LTC">Litecoin (LTC)</option>
          </select>
        </div>
  
        <div class="mb-3">
          <label for="quantity" class="form-label">Cantidad Comprada</label>
          <input type="number" class="form-control" id="quantity" v-model.number="formulario.crypto_amount" step="0.00001" min="0.00001" required>
          <div class="form-text">Introduce la cantidad de criptomoneda (número decimal).</div>
        </div>
  
        <div class="mb-3">
          <label for="amount" class="form-label">Monto Pagado (en Pesos Argentinos)</label>
          <input type="number" class="form-control" id="amount" v-model.number="formulario.money" step="0.01" required readonly>
          <div class="form-text">Monto calculado automáticamente en pesos argentinos.</div>
        </div>
  
        <button type="submit" class="btn btn-primary">Registrar Compra</button>
      </form>
    </div>
  </template>
  
  <script>
  import menuNavegacion from '@/components/menuNavegacion.vue';
  import { apiCriptoya, apiClient } from "@/axios";
  
  export default {
    name: 'formularioCompra',
  
    components: {
      menuNavegacion
    },
  
    data() {
      return {
        formulario: {
          crypto_code: "",
          crypto_amount: "",
          money: "",
          datetime: this.getCurrentDateTime(),
          user_id: localStorage.getItem('user') || 'No disponible',
          action: "purchase",
          tipoCambio: 0 // Variable para el tipo de cambio
        }
      };
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
  
      async actualizacionPesoArgentino() {
        const cryptoCode = this.formulario.crypto_code.toUpperCase();
        if (!cryptoCode) return;
  
        try {
          const response = await apiCriptoya.get(`/binance/${cryptoCode}/ARS/1`);
          console.log('Respuesta de la API:', response.data); // Verificar la respuesta de la API
          if (response.data && response.data.ask) {
            this.formulario.tipoCambio = response.data.ask;
            this.calculoTotal(); // Llamar a `calculoTotal` después de obtener el tipo de cambio
          } else {
            console.error('Respuesta de la API no contiene el precio');
            alert('No se pudo obtener el tipo de cambio. Verifica la criptomoneda seleccionada.');
          }
        } catch (error) {
          console.error('Error al obtener el tipo de cambio:', error);
          alert('No se pudo obtener el tipo de cambio. Inténtelo de nuevo.');
        }
      },
  
      calculoTotal() {
        const amount = this.formulario.crypto_amount;
        const cambio = this.formulario.tipoCambio;
        console.log('Cantidad:', amount, 'Tipo de cambio:', cambio); // Verificar valores antes del cálculo
        if (amount && cambio) {
          this.formulario.money = (amount * cambio).toFixed(2);
        } else {
          this.formulario.money = '';
        }
      },
  
      async formularioCompra() {
        try {
          const response = await apiClient.post('/transactions', this.formulario);
          alert(`Compra registrada con éxito: ${JSON.stringify(response.data.user_id)}`);
        } catch (error) {
          console.error('Error al registrar la compra:', error);
          alert('Error al registrar la compra. Por favor, inténtelo de nuevo.');
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