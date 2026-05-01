<script setup>
import { ref } from 'vue';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, 
         createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification} from "firebase/auth";

const emit = defineEmits(['login-exitoso']);
const auth = getAuth();
const providerGoogle = new GoogleAuthProvider();
const providerGithub = new GithubAuthProvider();

const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const esRegistro = ref(false);

async function loginUsuario() {
  if (!email.value || !password.value) return alert("Rellena todos los campos");
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
  } catch (error) {
    console.log("Error: " + error.message); 
  }
}

async function iniciaSesionSocial(red) {
  try {
    let provider;
    if (red === 'google') {
      provider = providerGoogle;
    } else if (red === 'github') {
      provider = providerGithub;
    }

    const result = await signInWithPopup(auth, provider);
    
    console.log("Usuario logueado con éxito:", result.user.displayName);
    
  } catch (error) { 
    // si el mismo email se usa en Google y GitHub
    if (error.code === 'auth/account-exists-with-different-credential') {
      console.log("Ya existe una cuenta con este email usando otro método de inicio de sesión.");
    } else {
      console.log("Error en social login:", error.message);
    }
  }
}

async function registrarUsuario() {
  if (password.value !== passwordConfirm.value) return alert("Las contraseñas no coinciden");
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    
    // Enviar el correo de verificación al usuario
    await sendEmailVerification(userCredential.user);
    
    console.log("Cuenta creada. Se ha enviado un correo de verificación a " + email.value);
    
    // vuelve al LandingPage
    esRegistro.value = false;
  } catch (error) { 
    console.log("Error al registrar: " + error.message); 
  }
}
</script>

<template>
  <div class="box">
    <h3>{{ esRegistro ? 'Crear Cuenta' : 'Acceso a tu Cuenta' }}</h3>
    <input type="email" v-model="email" placeholder="Email">
    <input type="password" v-model="password" placeholder="Contraseña">

    <div v-if="esRegistro">
      <input type="password" v-model="passwordConfirm" placeholder="Confirmar contraseña">
      <button class="btn-inicioSesion" @click="registrarUsuario">Registrarse ahora</button>
      <button @click="esRegistro = false" class="volver-login">Volver al Login</button>
    </div>

    <div v-else>
      <button class="btn-inicioSesion" @click="loginUsuario">Iniciar Sesión</button>
      <p class="separadorBotones">¿No tienes cuenta?</p>
      <button class="btn-crearCuenta" @click="esRegistro = true">Crear Cuenta</button>
    </div>

    <p class="separadorBotones">— o —</p>
    <span class="icon">
      <button class="btn-google" @click="iniciaSesionSocial('google')"><ion-icon name="logo-google"></ion-icon></button>
      <button class="btn-github" @click="iniciaSesionSocial('github')"><ion-icon name="logo-github"></ion-icon></button>
    </span>
  </div>
</template>


<style scoped>
/* CONTENEDOR LOGIN */
.box{
  width:100%;
  max-width:430px;
  padding:2.5rem;
  background:#ffffff;
  border-radius:28px;
  border:2px solid #e7d8ff;
  box-shadow:0 12px 35px rgba(87,33,209,0.08);
  font-family:'Segoe UI', sans-serif;
}

/* TITULO */
h3{
  text-align:center;
  font-size:2rem;
  font-weight:800;
  margin-bottom:2rem;
  color:#5721d1;
}

/* INPUTS */
input{
  width:100%;
  padding:14px 16px;
  margin-bottom:1rem;
  border:2px solid #ece7f8;
  border-radius:16px;
  font-size:1rem;
  background:#faf9ff;
  transition:0.3s;
  box-sizing:border-box;
}

input:focus{
  outline:none;
  border-color:#D944FF;
  background:#fff;
  box-shadow:0 0 0 4px rgba(193,28,132,0.08);
}

/* BOTONES GENERALES */
button{
  width:100%;
  padding:14px;
  border:none;
  border-radius:16px;
  cursor:pointer;
  font-size:1rem;
  font-weight:700;
  transition:0.3s;
  margin-bottom:12px;
}

/* BOTON PRINCIPAL */
.btn-inicioSesion,
.volver-login{
  background:linear-gradient(90deg,#5721d1,#D944FF);
  color:white;
}

.btn-inicioSesion:hover,
.volver-login:hover{
  transform:translateY(-2px);
  box-shadow:0 10px 20px rgba(193,28,132,0.18);
}

/* SECUNDARIO */
.btn-crearCuenta{
  background:#f4ecff;
  color:#5721d1;
  border:2px solid #d8c4ff;
}

.btn-crearCuenta:hover{
  background:#e8d8ff;
}

/* TEXTO */
.separadorBotones{
  text-align:center;
  margin:1rem 0;
  color:#8a8a8a;
  font-size:0.95rem;
}

/* ICONOS SOCIALES */
.icon{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:18px;
  margin-top:1rem;
}

.btn-google,
.btn-github{
  width:62px;
  height:62px;
  border-radius:50%;
  background:#f8f4ff;
  border:2px solid #e5d7ff;
  color:#5721d1;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:1.8rem;
  padding:0;
}

.btn-google:hover,
.btn-github:hover{
  background:linear-gradient(135deg,#5721d1,#D944FF);
  color:white;
  transform:translateY(-2px);
}

ion-icon{
  font-size:30px;
}

/* RESPONSIVE */
@media(max-width:768px){
  .box{
    padding:2rem 1.4rem;
    max-width:100%;
  }

  h3{
    font-size:1.6rem;
  }
}
</style>