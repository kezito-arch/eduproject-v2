
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import { auth } from "./js/firebase.js";

const formulario = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value;

  mensaje.textContent = "Iniciando sesión...";

  try {
    await signInWithEmailAndPassword(auth, correo, password);

    mensaje.textContent = "¡Inicio de sesión exitoso!";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);

  } catch (error) {
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      mensaje.textContent = "Correo o contraseña incorrectos.";
    } else {
      mensaje.textContent = "No se pudo iniciar sesión: " + error.message;
    }
  }
});