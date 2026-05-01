<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase';

const emit = defineEmits(['archivo-subido']);

const archivo = ref(null);

function adjuntarArchivo(e){
    archivo.value = e.target.files[0]
    console.log("Archivo seleccionado " + archivo.value.name);
}

async function altaRecordatorio() {
    if (archivo.value) {
        //Subir el archivo
        const { data, error } = await supabase.storage
            .from('ArchivosAdjuntos')
            .upload(`${Date.now()}_${archivo.value.name}`, archivo.value);

        if (!error) {
            //URL
            const { data: urlData } = supabase.storage
                .from("ArchivosAdjuntos")
                .getPublicUrl(data.path);

            // recibirá el padre
            emit('archivo-subido', {
                url: urlData.publicUrl,
                nombre: archivo.value.name
            });

            // Limpiar input y url
            archivo.value = null;
            document.querySelector('input[type="file"]').value = '';
        }
    }
}
</script>

<template>
    <form @submit.prevent ="altaRecordatorio">
        <input type="file" @change="adjuntarArchivo" placeholder="Subir archivo...">
        <button type="submit">Subir</button>
    </form>
</template>

<style scoped>
</style>