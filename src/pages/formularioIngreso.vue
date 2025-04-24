<template>
    <body>
       <div class="wrapper">
          <div class="logo">
             <img src="@/assets/logo-inicial.png" alt="logo Cryptocoin" />
          </div>
          <form @submit.prevent="iniciarSesion">
             <div class="field">
                <input type="text" v-model="user_id" id="user_id" required>
                <label>Nombre de Usuario</label>
             </div>
             <div class="field">
                <input type="submit" value="Quiero ingresar!">
             </div>
             <div v-if="mensajeError" class="error">{{ mensajeError }}</div>
          </form>
       </div>
    </body>
 </template>

<script>

export default {
    name: 'formularioIngreso',

    data() {
        return {
            user_id: "",
            mensajeError: ""
        }
    },

    methods: {
        async iniciarSesion() {
            try {
                if ((this.user_id).toLowerCase().trim() === 'cryptocoin2024') {
                    localStorage.setItem('user', this.user_id);
                    console.log('Usuario redirigido a la pantalla principal', this.user_id);
                    this.$router.push('/pantallaPrincipal');
                } else {
                    this.mensajeError = 'ID de ingreso incorrecto. Por favor, inténtelo nuevamente.';
                }
            } catch (error) {
                console.error('Error durante la validación de inicio de sesión:', error);
                this.mensajeError = 'Hubo un error inesperado. Por favor, inténtelo nuevamente.';
            }

        }
    }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,body{
  display: grid;
  height: 100%;
  width: 100%;
  place-items: center;
  background: #f2f2f2;
}

.wrapper{
  width: 380px;
  align-items: center;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0px 15px 20px rgba(0,0,0,0.1);
}
.wrapper .logo {
    height: 160px;
  line-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px 15px 0 0;
  background: linear-gradient(-135deg, #d12ff2, #35006d);
}

.wrapper .logo img {
  max-width: 100%;
  height: auto;
}
.wrapper form{
  padding: 10px 30px 50px 30px;
}
.wrapper form .field{
  height: 50px;
  width: 100%;
  margin-top: 20px;
  position: relative;
}
.wrapper form .field input{
  height: 100%;
  width: 100%;
  outline: none;
  font-size: 17px;
  padding-left: 20px;
  border: 1px solid lightgrey;
  border-radius: 25px;
  transition: all 0.3s ease;
}
.wrapper form .field input:focus,
form .field input:valid{
  border-color: #35006d;
}
.wrapper form .field label{
  position: absolute;
  top: 50%;
  left: 20px;
  color: #999999;
  font-weight: 400;
  font-size: 17px;
  pointer-events: none;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}
form .field input:focus ~ label,
form .field input:valid ~ label{
  top: 0%;
  font-size: 16px;
  color: #35006d;
  background: #fff;
  transform: translateY(-50%);
}

form .field input[type="submit"]{
  color: #fff;
  border: none;
  padding-left: 0;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  background: linear-gradient(-135deg, #d12ff2, #35006d);
  transition: all 0.3s ease;
}
form .field input[type="submit"]:active{
  transform: scale(0.95);
}

</style>