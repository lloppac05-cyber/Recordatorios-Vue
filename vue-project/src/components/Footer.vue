<script setup>
</script>

<template>
    <footer>
        <div class="copy">
            <p>&copy; 2026 Planix - Tu App de Recordatorios Online</p>
        </div>
        <div class="autora">
            <p>Desarrollado por Laura L</p>
            <p>
                Código disponible en 
                <a href="https://github.com/" target="_blank">
                    <ion-icon name="logo-github"></ion-icon>
                    GitHub
                </a>
            </p>        
        </div>
    </footer>
</template>

<style scoped>
footer {
  width: 100%;
  background: linear-gradient(90deg,#E8D8FF,#DCC5FF,#E8D8FF);
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

/* Texto copyright */
.copy p {
  font-size: 14px;
  color: #6b6b6b;
}

/* Autora */
.autora {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.autora p {
  font-size: 14px;
  color: #444;
}

/* Link GitHub */
.autora a {
  text-decoration: none;
  color: #C11C84;
  font-weight: 600;
  margin-left: 5px;
}

/* Icono */
ion-icon {
  font-size: 18px;
  vertical-align: middle;
  margin-right: 5px;
  color: #C11C84;
}
</style>