<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps(['texto', 'completada', 'fecha', 'prioridad','idDelUsuario', 'esAdmin', 'archivo']);
const emit = defineEmits(['editarNota', 'borrarNota', 'cambiarEstado', 'cambiarPrioridad']);

const ahora = ref(Date.now());
let intervalo;

onMounted(() => {
  // Actualizamos el valor de 'ahora' cada 60 seg para que el texto cambie solo
  intervalo = setInterval(() => {
    ahora.value = Date.now();
  }, 60000);
});

onUnmounted(() => {
  clearInterval(intervalo);
});

const tiempoTranscurrido = computed(() => {
  if (!props.fecha) return "Fecha desconocida";

  const diferenciaMs = ahora.value - props.fecha;
  const diferenciaMinutos = Math.floor(diferenciaMs / 60000);

  if (diferenciaMinutos < 1) return "Añadido ahora mismo";
  if (diferenciaMinutos < 60) return `Añadido hace ${diferenciaMinutos} minutos`;
  
  const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
  if (diferenciaHoras < 24) return `Añadido hace ${diferenciaHoras} horas`;

  return `Añadido hace ${Math.floor(diferenciaHoras / 24)} días`;
});


function rotarPrioridad() {
  let nuevaPrioridad;
   // De Normal (1) pasa a High (2)
  if (props.prioridad === 1) {
    nuevaPrioridad = 2;
     // De High (2) pasa a Low (0)
  } else if (props.prioridad === 2) {
    nuevaPrioridad = 0;
     // De Low (0) vuelve a Normal (1)
  } else {
    nuevaPrioridad = 1;
  }
  emit('cambiarPrioridad', nuevaPrioridad);
}

const etiquetaPrioridad = computed(() => {
  if (props.prioridad === 0) return "Low";
  if (props.prioridad === 2) return "High";
  return "Normal";
});

// Función para asignar una clase CSS según la prioridad
const clasePrioridad = computed(() => {
  if (props.prioridad === 0) return "prio-low";
  if (props.prioridad === 2) return "prio-high";
  return "prio-normal";
});
</script>

<template>
  <li class="nota-card">
    <div class="articulo-content">
      
      <!-- LADO IZQUIERDO-->
      <div class="main-section">
        <div class="checkbox-wrapper">
          <input 
            type="checkbox" 
            :checked="completada" 
            @change="emit('cambiarEstado')"
          >
        </div>

        <div class="info-wrapper" :class="{ ClaseTachado: completada }">
        
        <div class="nota-header">
          <div v-if="esAdmin" class="etiqueta-admin">
            ID: {{ idDelUsuario.substring(0, 6) }}
          </div>
          <span :class="['badge-prioridad', clasePrioridad]" @click="rotarPrioridad">
            {{ etiquetaPrioridad }}
          </span> 
          <span class="texto-nota">{{ texto }}</span>
        </div>

        <!-- inferior-->
        <small class="texto-fecha">
          <ion-icon name="time-outline"></ion-icon>
          {{ tiempoTranscurrido }}
        </small>
      </div>
      </div>

      <!-- LADO DERECHO -->
      <div class="acciones">
        <a v-if="archivo" :href="archivo" download="archivo" class="btn-descarga">
          <ion-icon name="cloud-download-outline"></ion-icon>
        </a>
        <button class="btn-editar" @click="emit('editarNota')">Editar</button>
        <button class="btn-borrar" @click="emit('borrarNota')">
          <ion-icon name="trash-bin"></ion-icon>
        </button>
      </div>

    </div>
  </li>
</template>

<style scoped>
.nota-card {
  background: white;
  margin-bottom: 16px;
  padding: 16px 20px;
  border-radius: 20px;
  list-style: none;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.nota-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
  border-color: #e2d5ff;
}

.articulo-content {
  display: flex;
  align-items: center; 
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.main-section {
  display: flex;
   /* Alinea arriba para notas largas */
  align-items: flex-start;
  gap: 18px;
  flex: 1;
}

.checkbox-wrapper {
  padding-top: 4px;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #5721d1;
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.titulo-fila {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.nota-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
}

.texto-nota {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.4;
  text-align: left;
  flex: 1;
}

.texto-fecha {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #999;
  font-size: 0.8rem;
  white-space: nowrap;
}

.texto-fecha ion-icon {
  font-size: 0.9rem; 
  flex-shrink: 0;
}

.badge-prioridad {
  font-size: 0.65rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
}

/* clases de prioridad */
.prio-low { background-color: #f0f0f0; color: #777; }
.prio-normal { background-color: #e3f2fd; color: #d944ff; }
.prio-high { background-color: #ffebee; color: #5721d1; }

.etiqueta-admin {
  font-size: 0.6rem;
  color: #5721d1;
  background: #f3efff;
  padding: 2px 8px;
  border-radius: 20px;
  width: fit-content;
  font-weight: 600;
  margin-bottom: 2px;
}

.acciones {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
}

button {
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.btn-editar { background-color: #d944ff; color: white; }
.btn-descarga { 
  background-color: #0066cc; 
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: 0.2s;
}
.btn-descarga:hover {
  background-color: #0052a3;
}
.btn-descarga ion-icon {
  font-size: 1.1rem;
}
.btn-borrar { background-color: #5721d1; color: white; }

.btn-borrar ion-icon {
  font-size: 1.1rem;
  color: white; /* Ajustado para mejor contraste */
}

/* Estado completado */
.ClaseTachado .texto-nota {
  text-decoration: line-through;
  color: #bbb;
}
.ClaseTachado .badge-prioridad {
  opacity: 0.5;
  filter: grayscale(1);
}
</style>