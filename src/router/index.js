import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Common Views
import HomeView from '@/views/common/HomeView.vue'
import LoginView from '@/views/common/LoginView.vue'
import RegisterView from '@/views/common/RegisterView.vue'

// Client Views
import NearbyView from '@/views/client/NearbyView.vue'
import BarbershopView from '@/views/client/BarbershopView.vue'
import MyQueueView from '@/views/client/MyQueueView.vue'

// Business Views
import DashboardView from '@/views/business/DashboardView.vue'
import QueueView from '@/views/business/QueueView.vue'
import ProfileView from '@/views/business/ProfileView.vue'
import BarbersView from '@/views/BarbersView.vue'
import ServicesView from '@/views/ServicesView.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guest: true }
  },
  
  // Client routes
  {
    path: '/nearby',
    name: 'nearby',
    component: NearbyView,
    meta: { requiresAuth: true, role: 'client' }
  },
  {
    path: '/barbershop/:id',
    name: 'barbershop',
    component: BarbershopView,
    meta: { requiresAuth: true, role: 'client' }
  },
  {
    path: '/my-queue',
    name: 'myQueue',
    component: MyQueueView,
    meta: { requiresAuth: true, role: 'client' }
  },
  
  // Business routes
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, role: 'business' }
  },
  {
    path: '/queue',
    name: 'queue',
    component: QueueView,
    meta: { requiresAuth: true, role: 'business' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/barbers',
    name: 'barbers',
    component: BarbersView,
    meta: { requiresAuth: true, role: 'business' }
  },
  {
    path: '/services',
    name: 'services',
    component: ServicesView,
    meta: { requiresAuth: true, role: 'business' }
  },
  
  // Catch-all route - redirect to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)
  const requiredRole = to.meta.role
  
  // Check if user is authenticated, if not already done
  if (!authStore.isLoggedIn && localStorage.getItem('token')) {
    await authStore.checkAuth()
  }
  
  // Handle authentication requirements
  if (requiresAuth && !authStore.isLoggedIn) {
    // Redirect to login if requires auth but not logged in
    next({ name: 'login' })
  } 
  else if (isGuestOnly && authStore.isLoggedIn) {
    // Redirect to appropriate home page if logged in and trying to access guest page
    if (authStore.isBusiness) {
      next({ name: 'dashboard' })
    } else {
      next({ name: 'nearby' })
    }
  }
  else if (requiresAuth && requiredRole && authStore.userRole !== requiredRole) {
    // Redirect if user doesn't have required role
    if (authStore.isBusiness) {
      next({ name: 'dashboard' })
    } else {
      next({ name: 'nearby' })
    }
  }
  else {
    // Proceed to route
    next()
  }
})

export default router