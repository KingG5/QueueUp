import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import QueueView from '../views/QueueView.vue'
import BarbersView from '../views/BarbersView.vue'
import ServicesView from '../views/ServicesView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/queue',
    name: 'queue',
    component: QueueView
  },
  {
    path: '/barbers',
    name: 'barbers',
    component: BarbersView
  },
  {
    path: '/services',
    name: 'services',
    component: ServicesView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
