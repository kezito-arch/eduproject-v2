
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import { auth, db } from "./js/firebase.js";

// Elementos HTML
const formulario = document.getElementById("formRecurso");
const lista = document.getElementById("listaRecursos");
const mensaje = document.getElementById("mensaje");
const filtro = document.getElementById("filtroCategoria");

// Variables
let usuarioActual = null;
let recursosCargados = [];

// Verificar usuario conectado
onAuthStateChanged(auth, (usuario) => {
  usuarioActual = usuario;

  if (!usuario) {
    mostrarMensaje("Inicia sesión para publicar recursos.");
  } else {
    mostrarMensaje("");
  }
});

// Mostrar mensajes
function mostrarMensaje(texto) {
  if (mensaje) {
    mensaje.textContent = texto;
  }
}

// Cargar recursos desde Firebase
async function mostrarRecursos() {
  try {
    const consulta = query(
      collection(db, "recursos"),
      orderBy("fecha", "desc")
    );

    const resultado = await getDocs(consulta);

    recursosCargados = resultado.docs.map((documento) => ({
      id: documento.id,
      ...documento.data()
    }));

    dibujarRecursos();
  } catch (error) {
    console.error("Error al cargar recursos:", error);
    mostrarMensaje("No se pudieron cargar los recursos.");
  }
}

// Dibujar y filtrar recursos
function dibujarRecursos() {
  if (!lista) {
    console.error('No existe el elemento HTML con id="listaRecursos".');
    return;
  }

  const categoriaElegida = filtro ? filtro.value : "Todas";

  const filtrados = recursosCargados.filter((recurso) => {
    const categoriaRecurso = recurso.categoria || "Otras";

    return (
      categoriaElegida === "Todas" ||
      categoriaRecurso === categoriaElegida
    );
  });

  lista.replaceChildren();

  if (filtrados.length === 0) {
    const aviso = document.createElement("p");
    aviso.textContent = "No hay recursos en esta categoría todavía.";
    lista.appendChild(aviso);
    return;
  }

  filtrados.forEach((recurso) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-recurso";

    const titulo = document.createElement("h3");
    titulo.textContent = recurso.titulo || "Sin título";

    const categoria = document.createElement("p");
    categoria.textContent =
      "Categoría: " + (recurso.categoria || "Otras");

    const descripcion = document.createElement("p");
    descripcion.textContent =
      recurso.descripcion || "Sin descripción";

    const autor = document.createElement("p");
    autor.textContent = "Publicado por: " + (recurso.autor || "Usuario");

    tarjeta.append(titulo, categoria, descripcion, autor);

    // Crear enlace seguro
    if (recurso.enlace) {
      try {
        const url = new URL(recurso.enlace);

        if (url.protocol === "https:" || url.protocol === "http:") {
          const enlace = document.createElement("a");
          enlace.href = url.href;
          enlace.textContent = "Abrir recurso";
          enlace.target = "_blank";
          enlace.rel = "noopener noreferrer";
          tarjeta.appendChild(enlace);
        }
      } catch (error) {
        console.warn("Enlace no válido:", recurso.id);
      }
    }

    lista.appendChild(tarjeta);
  });
}

// Activar filtro cuando se cambia la categoría
if (filtro) {
  filtro.addEventListener("change", dibujarRecursos);
}

// Publicar un recurso
if (formulario) {
  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!usuarioActual) {
      mostrarMensaje("Debes iniciar sesión antes de publicar.");
      return;
    }

    const titulo = document.getElementById("titulo")?.value.trim();
    const descripcion =
      document.getElementById("descripcion")?.value.trim();
    const enlace = document.getElementById("enlace")?.value.trim();
    const categoria = document.getElementById("categoria")?.value;

    if (!titulo || !descripcion || !enlace || !categoria) {
      mostrarMensaje("Completa todos los campos.");
      return;
    }

    if (titulo.length > 120 || descripcion.length > 1000) {
      mostrarMensaje("El título o la descripción son demasiado largos.");
      return;
    }

    let url;

    try {
      url = new URL(enlace);

      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error("Protocolo no permitido");
      }
    } catch (error) {
      mostrarMensaje("Escribe un enlace válido que empiece con https:// o http://");
      return;
    }

    try {
      mostrarMensaje("Publicando recurso...");

      await addDoc(collection(db, "recursos"), {
        titulo: titulo,
        descripcion: descripcion,
        enlace: url.href,
        categoria: categoria,
        autorId: usuarioActual.uid,
        autor: usuarioActual.email || "Usuario",
        fecha: serverTimestamp()
      });

      formulario.reset();

      if (filtro) {
        filtro.value = "Todas";
      }

      mostrarMensaje("¡Recurso publicado correctamente! 💚");
      await mostrarRecursos();
    } catch (error) {
      console.error("Error al publicar:", error);
      mostrarMensaje("No se pudo publicar. Revisa las reglas de Firestore.");
    }
  });
}

// Cargar los recursos al abrir la página
mostrarRecursos();