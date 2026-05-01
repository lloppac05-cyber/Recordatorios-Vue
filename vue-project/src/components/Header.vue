<script setup></script>


<template>
  <header class="header-planix">
    <div class="logo">
      <img src="../components/icons/logo.png" alt="Logo Planix">
    </div>

  </header>
</template>

<style>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family: Arial, Helvetica, sans-serif;
}

/* HEADER */
.header-planix{
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0rem 2.5rem;
  background: linear-gradient(90deg,#E8D8FF,#DCC5FF,#E8D8FF);
}

/* LOGO */
.logo img{
  height:100px;
  width:auto;
}

/* BOTON LOGIN */
.link-login{
  text-decoration:none;
  color:#D944FF;
  border:2px solid #D944FF;
  padding:0.7rem 1.5rem;
  border-radius:14px;
  font-weight:bold;
  background:white;
  transition:0.3s ease;
}

nav a:hover{
  background:#D944FF;
  color:white;
  transform:translateY(-2px);
  box-shadow:0 6px 15px rgba(193,28,132,0.25);
}

/* RESPONSIVE */
@media(max-width:768px){
  .header-planix{
    padding:1rem;
  }

  .logo img{
    height:50px;
  }

  nav a{
    padding:0.5rem 1rem;
    font-size:14px;
  }
}
</style>