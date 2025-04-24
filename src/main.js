import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import axios from 'axios';
import {createBootstrap} from 'bootstrap-vue-next';
import VueAxios from 'vue-axios';

// Crear la aplicación Vue
const app = createApp(App);

// Usar los plugins
app.use(router);
app.use(createBootstrap); // Configuración correcta de BootstrapVueNext
app.use(VueAxios, axios);

// Montar la aplicación
app.mount('#app');

// Importar estilos
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';