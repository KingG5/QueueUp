import { createStore } from 'vuex';
import { fetchUserData } from '../firebase/auth';

const store = createStore({
  state() {
    return {
      user: null,
      userData: null,
      authIsReady: false
    };
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USER_DATA(state, data) {
      state.userData = data;
    },
    SET_AUTH_IS_READY(state, ready) {
      state.authIsReady = ready;
    }
  },
  actions: {
    async getUserData({ commit }, uid) {
      const data = await fetchUserData(uid);
      commit('SET_USER_DATA', data);
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    userRole: (state) => state.userData?.role || null
  }
});

export default store;