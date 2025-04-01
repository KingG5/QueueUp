// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/barbershops',
    name: 'BarbershopList',
    component: () => import('../views/BarbershopList.vue')
  },
  {
    path: '/barbershop/:id',
    name: 'BarbershopDetail',
    component: () => import('../views/BarbershopDetail.vue')
  },
  {
    path: '/join-queue',
    name: 'JoinQueue',
    component: () => import('../views/JoinQueuePage.vue')
  },
  {
    path: '/my-queue',
    name: 'MyQueue',
    component: () => import('../views/MyQueuePage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;