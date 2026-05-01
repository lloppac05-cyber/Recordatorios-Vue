<script setup>
import { ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router"; 
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const auth = getAuth();
const router = useRouter(); 

const logueado = ref(false);
const nombreUsuario = ref("");
const imgUsuario = ref("");
const idUsuario = ref("");
const esAdmin = ref(false);

const fotoPorDefecto = "https://i.pinimg.com/736x/f8/13/40/f81340231e138bd62859ba2cc6318047.jpg";

// CONFIGURACIÓN DEL ADMINISTRADOR
const EMAIL_ADMIN = "admin@gmail.com"; 

onAuthStateChanged(auth, (user) => {
  if (user) {
    logueado.value = true;
    idUsuario.value = user.uid;
    nombreUsuario.value = user.displayName || user.email;
    imgUsuario.value = user.photoURL;
    esAdmin.value = user.email === EMAIL_ADMIN;

    if (router.currentRoute.value.path === '/') {
      router.push('/listarecordatorios'); 
    }
  } else {
    logueado.value = false;
    idUsuario.value = "";
    esAdmin.value = false;
    
    if (router.currentRoute.value.path !== '/') {
      router.push('/');
    }
  }
});

function cerrarSesion() {
  signOut(auth).then(() => {
    router.push('/');
  });
}

 // controlar vista
const mostrarTodo = ref(false);

function cambiarVista() {
  mostrarTodo.value = !mostrarTodo.value;
}
</script>

<template>
  <Header></Header>
  <div class="landing-container">
    
    <div class="info-column">
      <div class="texto-superior">
        <h1>Bienvenido a Planix</h1>
        <p class="slogan-principal">Nunca olvides nada</p>
      </div>
      <!-- usuario logueado-->
      <div class="container user-panel-container" v-if="logueado">
        <header class="user-header">
          <div class="user-info">
            <p><strong>{{ nombreUsuario }}</strong></p>
            <div v-if="esAdmin">
              <span class="badge-admin">ADMIN</span>
              <button class="cambiar-vista" @click="cambiarVista">
                {{ mostrarTodo ? 'Ver SOLO mis tareas' : 'Ver TODAS las tareas' }}
              </button>
            </div>
            <img :src="imgUsuario || fotoPorDefecto" referrerpolicy="no-referrer" class="avatar">
          </div>
          <button class="btn-cerrarSesion" @click="cerrarSesion"><ion-icon name="log-out-outline"></ion-icon></button>
        </header>
      </div>
      <div class="imagen-central">
        <img src="../src/components/icons/calendario.png" alt="Planix Visual">
      </div>

      <div class="caracteristicas-list">
        <h2>Recordatorios App</h2>
        <ul>
          <li><ion-icon name="journal-outline" role="img" arial-labe="agenda"></ion-icon> Crea Notas Rápidas</li>
          <li><ion-icon name="list-outline" role="img" arial-labe="lista"></ion-icon> Ordenalas por prioridad</li>
          <li><ion-icon name="download-outline" role="img" arial-labe="descarga"></ion-icon> Sube archivos a ellas</li>
        </ul>
      </div>
    </div>

    <!--Login Form-->
    <div class="login-card">
      <h2 v-if="!logueado">Acceso a tu Cuenta</h2>
      <RouterView 
        :idUsuario="idUsuario" 
        :esAdmin="esAdmin" 
        :mostrarTodo="mostrarTodo"
      ></RouterView>
    </div>

  </div>
  <Footer></Footer>
</template>

<style scoped>
/* FONDO GENERAL Y TIPOGRAFÍA */
:global(body){
  margin:0;
  padding:0;
  font-family:'Segoe UI', sans-serif;
  background:#f8f4ff;
}

/* CONTENEDOR PRINCIPAL*/
.landing-container{
  width:100%;
  display:flex;
  flex-direction: row;
  align-items:flex-start;
  justify-content: space-around;
  padding: 4rem 10%;
  gap: 3rem;
  min-height: 80vh;
  box-sizing: border-box;
}

/* COLUMNA IZQUIERDA */
.info-column {
  flex: 1;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* TÍTULO Y SLOGAN */
.texto-superior {
  text-align: left;
}

.texto-superior h1{
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background:linear-gradient(90deg,#5721d1,#D944FF);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.texto-superior p.slogan-principal{
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  font-weight: 500;
}

/* IMAGEN */
.imagen-central {
  width: 100%;
  display: flex;
  justify-content: center;
}

.imagen-central img{
  width: 800px;
  height: auto;
}

/* LISTA DE CARACTERÍSTICAS */
.caracteristicas-list {
  text-align: left;
}

.caracteristicas-list h2 {
  font-size: 1.3rem;
  color: #d944ff;
  margin: 0 0 1rem 0;
}

.caracteristicas-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.caracteristicas-list li {
  font-size: 1rem;
  color: #444;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.caracteristicas-list li ion-icon {
  font-size: 1.2rem;
  color: #d944ff;
}

/* LOGIN CARD */
.login-card{
  flex: 0 0 380px;
  background:#fff;
  border: 1px solid #dcdcdc;
  border-radius:20px;
  padding: 2.5rem;
  margin-top: 1.5rem;
}

.login-card h2{
  text-align:center;
  color: #5721d1;
  font-size: 1.6rem;
  margin-bottom: 2rem;
}

/* INPUTS */
.login-card input{
  width:100%;
  padding: 14px;
  margin-bottom: 1.2rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  box-sizing: border-box;
}

.login-card input:focus{
  border-color: #5721d1;
  outline: none;
}

/* BOTON */
.login-card button{
  width:100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background-color: #ccc; /* El gris de la maqueta */
  color: #333;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.login-card button:hover{
  background-color: #bbb;
}

/* USUARIO LOGUEADO */
.user-panel-container {
  padding: 1rem;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.badge-admin {
  background: #D944FF;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.btn-cerrarSesion{
  background-color: #5721d1;
  color: white;
  border: 1.5px solid #5721d1;
  padding: 10px;
  margin-left: 15px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cerrarSesion:hover {
  background-color: #5621d14c;
  color:#5721d1;
}

.cambiar-vista{
  background-color: white;
  color: #D944FF;
  border: 1px solid #D944FF;
  padding: 3px 15px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.cambiar-vista:hover{
  background-color: #da44ff89;
  color: white;
}


/* RESPONSIVE */
@media(max-width: 950px){
  .landing-container{
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 3rem 1.5rem;
    gap: 3rem;
  }

  .info-column {
    max-width: 100%;
    align-items: center;
  }

  .texto-superior {
    text-align: center;
  }

  .texto-superior h1 {
    font-size: 2.2rem;
  }

  .caracteristicas-list {
    text-align: center;
  }
  
  .caracteristicas-list ul {
    display: inline-block;
    text-align: left;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
  }
}
</style>