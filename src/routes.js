import { createRouter, createWebHistory } from 'vue-router'
import formularioIngreso from '@/pages/formularioIngreso.vue'
import pantallaPrincipal from '@/pages/pantallaPrincipal.vue'
import formularioCompra from '@/pages/formularioCompra.vue'
import formularioVenta from '@/pages/formularioVenta.vue'
import formularioEditar from '@/pages/formularioEditar.vue'
import historialMovimientos from '@/pages/historialMovimientos.vue'
import billeteraVirtual from '@/pages/billetera.vue'
import pruebaForm from '@/pages/pruebaaaaaaaa.vue'

const routes = [
    {
        path: '/',
        name: 'formularioIngreso',
        component: formularioIngreso
    },
    {
        path: '/pantallaPrincipal',
        name: 'pantallaPrincipal',
        component: pantallaPrincipal
    },
    {
        path: '/formularioCompra',
        name: 'formularioCompra',
        component: formularioCompra
    },
    {
        path: '/formularioVenta',
        name: 'formularioVenta',
        component: formularioVenta
    },
    {
        path: '/formularioEditar/:id',
        name: 'formularioEditar',
        component: formularioEditar
    },
    {
        path: '/historialMovimientos',
        name: 'historialMovimientos',
        component: historialMovimientos
    },
    {
        path: '/billeteraVirtual',
        name: 'billeteraVirtual',
        component: billeteraVirtual
    },
    {
        path: '/pruebaForm',
        name: 'pruebaForm',
        component: pruebaForm
    }
]

// Crear el enrutador
const router = createRouter({
    history: createWebHistory(), // Usa el historial HTML5
    routes
})

export default router