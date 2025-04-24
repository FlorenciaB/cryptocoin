<template>
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingSpinner',
  };
  </script>
  
  <style scoped>
  /* Estilos para el spinner */
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }
  
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  