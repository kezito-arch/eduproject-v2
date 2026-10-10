
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import { auth } from "./js/firebase.js";

const formulario = document.getElementById("formRegistro");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  try {
    const credencial = await createUserWithEmailAndPassword(
      auth,
      correo,
      password
    );

    await updateProfile(credencial.user, {
      displayName: nombre
    });

    mensaje.textContent = "¡Cuenta creada correctamente!";
    formulario.reset();

  } catch (error) {
    mensaje.textContent = "Error: " + error.message;
  }
});