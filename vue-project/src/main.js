import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import App from './App.vue';
import LandingPage from '../src/components/LandingPage.vue';
import ListaRecordatorios from '../src/components/ListaRecordatorios.vue';
import Administracion from '../src/components/Administracion.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNt0RN6R--haaBAKXdUiE4pWlj76HjwDw",
  authDomain: "vuelistarecordatorios.firebaseapp.com",
  projectId: "vuelistarecordatorios",
  storageBucket: "vuelistarecordatorios.firebasestorage.app",
  messagingSenderId: "339855592466",
  appId: "1:339855592466:web:11b0e0b8f176c342f89ccb",
  measurementId: "G-CV5JN8CPDC"
};

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const auth = getAuth();

const routes = [
    { path: '/', component: LandingPage },
    { path: '/listarecordatorios', component: ListaRecordatorios, meta: { requiresAuth: true } },
    { path: '/administracion', component: Administracion, meta: { requiresAuth: true, requiresAdmin: true } }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

// --- MEJORA DEL GUARD DE NAVEGACIÓN ---
// Función para obtener el usuario actual de forma asíncrona una sola vez
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(auth, (user) => {
            removeListener(); // Nos desuscribimos inmediatamente tras obtener el dato
            resolve(user);
        }, reject);
    });
};

router.beforeEach(async (to, from) => {
    const user = await getCurrentUser();
    const emailAdmin = "lloppac05@gmail.com"; // Tu email configurado

    // 1. Si la ruta requiere estar logueado y no hay usuario -> Al Login (/)
    if (to.meta.requiresAuth && !user) {
        return '/';
    }

    // 2. Si requiere ser admin y no lo es -> A Recordatorios
    if (to.meta.requiresAdmin && user?.email !== emailAdmin) {
        return '/listarecordatorios';
    }

    // 3. Si el usuario ya está logueado e intenta ir al login (/) -> A Recordatorios
    if (user && to.path === '/') {
        return '/listarecordatorios';
    }

    return true; // Continúa la navegación normal
});

const app = createApp(App)
app.use(router)
app.mount('#app')