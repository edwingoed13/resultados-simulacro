// CONFIGURACIÓN: Reemplaza con tu URL de Netlify
// Ejemplo: https://tu-sitio.netlify.app/.netlify/functions/consultar
const API_URL = '/.netlify/functions/consultar';

const form = document.getElementById("consultaForm");
const dniInput = document.getElementById("dni");
const btnConsultar = document.getElementById("btnConsultar");
const loading = document.getElementById("loading");
const resultado = document.getElementById("resultado");
const error = document.getElementById("error");

// Elementos del resultado
const resDni = document.getElementById("resDni");
const resNombre = document.getElementById("resNombre");
const resPuntaje = document.getElementById("resPuntaje");
const resArea = document.getElementById("resArea");
const errorMsg = document.getElementById("errorMsg");

// Validar solo números en el input DNI
dniInput.addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Manejar el envío del formulario
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const dni = dniInput.value.trim();

  // Validar DNI
  if (dni.length !== 8) {
    mostrarError("El DNI debe tener 8 dígitos");
    return;
  }

  // Mostrar loading
  ocultarTodo();
  loading.classList.remove("hidden");
  btnConsultar.disabled = true;

  try {
    // Realizar la consulta
    const response = await fetch(`${API_URL}?dni=${dni}`);

    if (!response.ok) {
      throw new Error("Error en la consulta");
    }

    const data = await response.json();

    if (data.success) {
      mostrarResultado(data.data);
    } else {
      mostrarError(
        data.message || "No se encontraron resultados para este DNI"
      );
    }
  } catch (err) {
    console.error("Error:", err);
    mostrarError(
      "Error al consultar. Verifica tu conexión o contacta al administrador."
    );
  } finally {
    loading.classList.add("hidden");
    btnConsultar.disabled = false;
  }
});

function mostrarResultado(data) {
  ocultarTodo();

  resDni.textContent = data.dni;
  resNombre.textContent = data.nombre;
  resPuntaje.textContent = data.puntaje;
  resArea.textContent = data.area;

  resultado.classList.remove("hidden");
}

function mostrarError(mensaje) {
  ocultarTodo();
  errorMsg.textContent = mensaje;
  error.classList.remove("hidden");
}

function ocultarTodo() {
  loading.classList.add("hidden");
  resultado.classList.add("hidden");
  error.classList.add("hidden");
}
