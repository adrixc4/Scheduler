import { constants } from './constants.js';

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    const form = document.getElementById("loginForm");
    const usuario = document.getElementById("usuario");
    const contraseña = document.getElementById("contraseña");
    const usuarioError = document.getElementById("usuarioError");
    const contraseñaError = document.getElementById("contraseñaError");

    form.addEventListener("submit", async function (e) {
      e.preventDefault(); // evitar envío por defecto

      let isValid = true;

      // Limpiar mensajes anteriores
      usuarioError.textContent = "";
      contraseñaError.textContent = "";

      // Validar usuario
      if (usuario.value.trim() === "") {
        usuarioError.textContent = "Por favor ingresa tu usuario.";
        isValid = false;
      }

      // Validar contraseña
      if (contraseña.value.trim() === "") {
        contraseñaError.textContent = "Por favor ingresa tu contraseña.";
        isValid = false;
      }

      if (isValid) {
        formError.style.display = "none";

        try{
            const response = await fetch(constants.apiURL + "/usuario/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: usuario.value,
            contraseña: contraseña.value,
          }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Inicio de sesión exitoso:", data);
            // Guardar token en localStorage
            localStorage.setItem("token", data.token);
            // Redirigir a la página principal
            window.location.href = "index.html";
        } else if (response.status === 401) {
            formError.textContent = "Usuario o contraseña incorrectos.";
            formError.style.display = "block";
        }
        else {
            formError.textContent = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
            formError.style.display = "block";
        }
        } catch (error) {
          console.error("Error al enviar la solicitud:", error);
          formError.textContent = "Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.";
          formError.style.display = "block";
          return;
        }
      }
    });
}