<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { 
  collection, 
  getFirestore, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc ,
  orderBy
} from 'firebase/firestore';
import Recordatorio from "../components/Recordatorio.vue";
import supabaseStorage from "./supabaseStorage.vue";

const props = defineProps(['idUsuario', 'esAdmin','mostrarTodo']);
const emit = defineEmits(['evento-editar']);
const db = getFirestore();

const prioridadSeleccionada = ref(1);
const texto = ref("");
const archivo = ref("");
const listaRecordatorios = ref([]);
let unsubscribe;

function recibirArchivo(url) {
  archivo.value = url;
  console.log("URL recibida en padre:", url);
}

// CONEXIÓN EN TIEMPO REAL
onMounted(() => {
  obtenerTareas();
});

// cambiar de vista a todas las tarear el admind
watch(() => props.mostrarTodo, () => {
  obtenerTareas();
});

// Detectar cuando el ID de usuario llega 
watch(() => props.idUsuario, () => {
  obtenerTareas();
});

// Limpiar conexión al salir
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const adjuntoTemporal = ref(null);

function manejarSubida(datos) {
    adjuntoTemporal.value = datos;
}

// --- FUNCIONES ---
async function anadirElemento() {
  if (!texto.value) return;

  const nuevaNota = {
    texto: texto.value,
    comprado: false,
    usuario: props.idUsuario,
    fecha: Date.now(),
    prioridad: parseInt(prioridadSeleccionada.value),
    archivo: adjuntoTemporal.value ? adjuntoTemporal.value.url : "",
    nombreArchivo: adjuntoTemporal.value ? adjuntoTemporal.value.nombre : "" 
  };
  await addDoc(collection(db, "notas"), nuevaNota);

  // limpiar
  texto.value = "";
  prioridadSeleccionada.value = 1;
  adjuntoTemporal.value = null;
}

async function eliminarNota(nota) {
  await deleteDoc(doc(db, "notas", nota.id));
}

async function actualizarEstado(nota) {
  await updateDoc(doc(db, "notas", nota.id), {
    comprado: !nota.comprado
  });
}

function iniciarEdicion(nota) {
  const nuevoTexto = prompt("Nueva nota:", nota.texto);
  if (nuevoTexto && nuevoTexto.trim() !== "") {
    actualizarNota(nota.id, nuevoTexto);
  }
}

async function actualizarNota(id, nuevoTexto) {
  await updateDoc(doc(db, "notas", id), { texto: nuevoTexto });
}

// CONTADOR
const tareasContador = computed(() => {
  const total = listaRecordatorios.value.length;
  const completadas = listaRecordatorios.value.filter(nota => nota.comprado).length;
  
  return `${completadas}/${total}`;
});

// --- FUNCIÓN PARA BORRAR TODO ---
async function vaciarLista() {
  // Creamos el array de promise
  const borrar = listaRecordatorios.value.map(nota => 
    deleteDoc(doc(db, "notas", nota.id))
  );
  
  // Esperamos a que todas las peticiones de borrado terminen
  await Promise.all(borrar);
  
  console.log("Lista vaciada correctamente");
}

// FUNCION PARA CAMBIAR EL TIPO DE prioridad
async function cambiarPrioridadNota(id, nuevaPrioridad) {
  const notaRef = doc(db, "notas", id);
  await updateDoc(notaRef, {
    prioridad: nuevaPrioridad
});
}

//lista ordenada 
const listaOrdenada = computed(() => {
  // copia de la lista
  return [...listaRecordatorios.value].sort((a, b) => {
    // TODAS LAS NOTAS DEL MISMO USER JUNTAS
    if (a.usuario > b.usuario) return 1;
    if (a.usuario < b.usuario) return -1;

    //ordenamos por Prioridad
    return b.prioridad - a.prioridad;
  });
});

// FUNCION PARA CAMBIAR LA VISTA DEL ADMIN
const obtenerTareas = () => {
  // Cerramos la conexión 
  if (unsubscribe) unsubscribe();

  let q;
  // Si es Admin Y tiene el botón activado, ve TODO. 
  // SINO, SOLO VE LO SUYO
  if (props.esAdmin && props.mostrarTodo) {
    q = query(collection(db, "notas"));
  } else if (props.idUsuario) {
    q = query(collection(db, "notas"), where("usuario", "==", props.idUsuario));
  } else {
    return;
  }

  //cerrar conexion
  unsubscribe = onSnapshot(q, (snapshot) => {
    listaRecordatorios.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
};
</script>

<template>
  <div>
    <div class="input-group">
      <div class="group-sin-btn">
        <input type="text" v-model="texto" @keyup.enter="anadirElemento" placeholder="Nueva nota...">
        <select v-model="prioridadSeleccionada" class="select-prioridad">
          <option value="0">Low</option>
          <option value="1">Normal</option>
          <option value="2">High</option>
        </select>
        <supabaseStorage @archivo-subido="manejarSubida"></supabaseStorage>
      </div>
      
      <button @click="anadirElemento" class="btn-anadir">Añadir</button>
    </div>

    <h2>{{ listaRecordatorios.length === 0 ? 'La lista está vacía' : 'No lo olvides...' }}</h2>

    <TransitionGroup name="list" tag="ul" class="lista-notas">
        <Recordatorio 
            v-for="nota in listaOrdenada" 
            :key="nota.id" 
            :idDelUsuario="nota.usuario" 
            :esAdmin="props.esAdmin"
            :texto="nota.texto"     
            :completada="nota.comprado"  
            :fecha="nota.fecha"
            :prioridad="nota.prioridad"
            :archivo="nota.archivo"
            @borrarNota="eliminarNota(nota)"
            @editarNota="iniciarEdicion(nota)"
            @cambiarEstado="actualizarEstado(nota)"
            @cambiarPrioridad="(nueva) => cambiarPrioridadNota(nota.id, nueva)"
        ></Recordatorio>
    </TransitionGroup>

    <div class="footer-lista">
        <p class="contador-texto">Tareas completadas: {{ tareasContador }}</p>
        <button class="btn-vaciar" @click="vaciarLista">Vaciar Lista</button>
    </div>
  </div>
</template>

<style scoped>
.input-group { 
    display: flex; 
    gap: 10px; 
    margin-bottom: 20px; 
    justify-content: center; 
}

.input-group [type="text"]{
    border-radius: 10px;
    border: 1.5px solid #5721d1;
    padding: 10px;
    margin-bottom: 10px;
}

.select-prioridad{
  background-color: #d6f1ff;
  color:#5721d1 ;
  border: none;
  border-radius: 10px;
}

.footer-lista { 
    margin-top: 20px; 
    text-align: center; 
}
.btn-anadir { 
    background-color: #5721d1; 
    color: white; 
    border: 1px solid #5721d1; 
    padding: 10px; 
    border-radius: 8px; 
    cursor: pointer; 
}

.btn-anadir:hover { 
    background-color: #5621d176; 
    color: #5721d1; 
    border: 1px solid #5721d1; 
}

.group-sin-btn{
  border-radius: 10px;
  border: 1px solid #5721d1;
  padding: 10px;
}

.contador-texto { 
    color: #d944ff; 
    font-weight: bold;

}

.btn-vaciar{
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: #d944ff;
  color: white;
}

.btn-vaciar:hover{
  border: 1.5px solid #d944ff;
  background-color: #d941ffa2;
  color: white;
}

/* TRANSISION DE ENTRADA AL CREAR Y DE SALIDA AL ELIMINAR UNA NOTA */
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-move {
  transition: transform 0.4s ease;
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>