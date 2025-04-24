<template>
    <nav>
      <menuNavegacion />
    </nav>
    <div class="container">
      <h2>Listado de Movimientos</h2>
      <div class="movimientos-grid">
        <div class="header">Criptomoneda</div>
        <div class="header">Cantidad</div>
        <div class="header">Monto (ARS)</div>
        <div class="header">Acción</div>
        <div class="header">Fecha y Hora</div>
        <div class="header">Acciones</div>
  
        <!-- Mostrar cada movimiento en una fila completa -->
        <div v-for="movimiento in movimientos" :key="movimiento._id" class="grid-item">
          <p>{{ mapCryptoCode(movimiento.crypto_code) }}</p>
          <p>{{ movimiento.crypto_amount }}</p>
          <p>{{ movimiento.money }}</p>
          <p>{{ mapAction(movimiento.action) }}</p>
          <p>{{ movimiento.datetime }}</p>
          <div class="action-buttons">
            <button class="btn-edit" @click="logId(movimiento._id, movimiento.datetime)">
              <router-link :to="{ name: 'formularioEditar', params: { id: movimiento._id, datatime: movimiento.datetime } }" class="nav-link">Editar</router-link>
            </button>
            <button class="btn-delete" @click="confirmaElimina(movimiento._id)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </template>



<script>
import menuNavegacion from '@/components/menuNavegacion.vue';
import { apiClient } from "@/axios";

export default {
  name: 'historialMovimientos',

  components: {
    menuNavegacion
  },

  data() {
    return {
      movimientos: []
    };
  },

  methods: {
    logId(id, datatime) {
      console.log('ID que se va a pasar:', id, datatime);
    },

    mapCryptoCode(crypto_code) {
    const mapping = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'LTC': 'Litecoin',
      };

      return mapping[crypto_code] || crypto_code;
    },

    mapAction(action) {
      const mapping = {
        'purchase': 'Compra',
        'sale': 'Venta',
      };
      return mapping[action] || action;
    },

    confirmaElimina(id) {
      if (window.confirm('¿Estás seguro de que querés eliminar este ítem?')) {
        this.eliminaItem(id);
      }
    },

    eliminaItem(id) {
      apiClient.delete(`/transactions/${id}`)
        .then(response => {
          this.movimientos = this.movimientos.filter(movimiento => movimiento._id !== id);
          console.log('Ítem eliminado con éxito', response);
        })
        .catch(error => {
          console.error('Error al eliminar el ítem', error);
        });
    },
  },

  async created() {
    try {
      
      const userId = localStorage.getItem('user');
      const response = await apiClient.get('/transactions');
      const todosLosMovimientos = response.data;

      this.movimientos = todosLosMovimientos.filter(movimiento => movimiento.user_id === userId);

    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
      alert('Error al obtener los movimientos. Por favor, inténtelo de nuevo.');
    }
  },
}
</script>

<style scoped>
/* Estilos para el contenedor de la cuadrícula */
.movimientos-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 columnas iguales */
  gap: 10px; /* Espacio entre los elementos */
  margin-top: 20px;
}

/* Estilos para los elementos de encabezado */
.header {
  font-weight: bold;
  text-align: center;
  background-color: #f4f4f4;
  padding: 10px;
}

/* Estilos para los elementos de cada fila */
.grid-item {
  display: contents; /* Permite que los elementos hijos ocupen la cuadrícula */
}

/* Estilos para las celdas en cada fila */
.grid-item p {
  margin: 0;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

/* Estilos para los botones de acción */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  grid-column: 6 / 7; /* Ocupa la última columna */
}

/* Estilos para los botones individuales */
.btn-view,
.btn-edit,
.btn-delete {
  padding: 5px 10px;
  border: none;
  color: #fff;
  cursor: pointer;
}

.btn-view { background-color: #007bff; }
.btn-edit { background-color: #28a745; }
.btn-delete { background-color: #dc3545; }
</style>