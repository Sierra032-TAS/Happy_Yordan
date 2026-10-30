/* =====================================================
   CONFIGURACIÓN EDITABLE — modifica solo esta sección
   ===================================================== */
const CONFIG = {
  nombre: "Yordan",                          // Nombre del cumpleañero
  fecha: "2026-11-03",                       // Formato AAAA-MM-DD
  hora: "19:30",                             // Formato 24 h HH:MM
  whatsapp: "573132868997",                  // Número del organizador con indicativo (sin + ni espacios)
  meet: "https://meet.google.com/meet/oja-eswx-hra" // Enlace de Google Meet
};

/* ================= UTILIDADES ================= */
const $ = (id) => document.getElementById(id);
const fechaEvento = new Date(`${CONFIG.fecha}T${CONFIG.hora}:00`);

/* ============ MENSAJES DE WHATSAPP ============ */
const MENSAJE_SI = "¡Hola! Confirmo mi asistencia al cumpleaños de Yordan. ¡Muchas gracias por la invitación! Allí estaré para compartir este momento tan especial. 🎉🎂";
const MENSAJE_NO = "¡Hola! Muchas gracias por la invitación al cumpleaños de Yordan. Lamentablemente no podré acompañarlos en esta ocasión, pero le deseo un feliz cumpleaños y que disfrute mucho su día. 🎂";

/* Abre WhatsApp con el mensaje ya escrito (wa.me) */
function abrirWhatsApp(mensaje) {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  // Se abre de inmediato dentro del clic para que los navegadores móviles no lo bloqueen
  const ventana = window.open(url, "_blank", "noopener");
  if (!ventana) window.location.href = url; // respaldo si el navegador bloquea la ventana
}

/* ============ RELLENAR DATOS DESDE LA CONFIG ============ */
function cargarDatos() {
  $("nombreTitulo").textContent = CONFIG.nombre.toUpperCase();
  $("nombreMensaje").textContent = CONFIG.nombre;
  $("detCelebracion").textContent = `Cumpleaños de ${CONFIG.nombre}`;

  $("detFecha").textContent = fechaEvento.toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  $("detHora").textContent = fechaEvento.toLocaleTimeString("es-CO", {
    hour: "numeric", minute: "2-digit", hour12: true
  });

  $("detEnlace").href = CONFIG.meet;
  $("detEnlace").textContent = CONFIG.meet;
  $("btnMeet").href = CONFIG.meet;
}

/* ============ PANTALLA DE BIENVENIDA ============ */
function abrirInvitacion() {
  const bienvenida = $("bienvenida");
  bienvenida.classList.add("salir");
  $("invitacion").classList.remove("oculto");
  window.scrollTo(0, 0);
  lanzarConfeti(120);
  setTimeout(() => { bienvenida.style.display = "none"; activarReveal(); }, 900);
}

/* ============ SCROLL REVEAL ============ */
function activarReveal() {
  const elementos = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  elementos.forEach((el) => obs.observe(el));
}

/* ============ CUENTA REGRESIVA ============ */
function actualizarContador() {
  const resta = fechaEvento - new Date();
  if (isNaN(resta)) return;

  if (resta <= 0) {
    $("contador").classList.add("oculto");
    $("mensajeFinal").classList.remove("oculto");
    clearInterval(temporizador);
    return;
  }
  const dos = (n) => String(n).padStart(2, "0");
  $("cDias").textContent = dos(Math.floor(resta / 86400000));
  $("cHoras").textContent = dos(Math.floor((resta / 3600000) % 24));
  $("cMinutos").textContent = dos(Math.floor((resta / 60000) % 60));
  $("cSegundos").textContent = dos(Math.floor((resta / 1000) % 60));
}
let temporizador;

/* ============ CONFIRMACIÓN DE ASISTENCIA ============ */
function confirmarAsistencia() {
  abrirWhatsApp(MENSAJE_SI);   // primero WhatsApp (dentro del clic)
  lanzarConfeti(260);
  mostrarRespuesta("🎉 ¡Qué alegría! Se abrió WhatsApp con tu mensaje listo: solo presiona ENVIAR.");
}

function rechazarAsistencia() {
  abrirWhatsApp(MENSAJE_NO);
  mostrarRespuesta("💛 Gracias por responder. Se abrió WhatsApp con tu mensaje listo; solo presiona ENVIAR.");
}

function mostrarRespuesta(texto) {
  const caja = $("respuesta");
  caja.textContent = texto;
  caja.classList.remove("oculto");
}

/* ============ GLOBOS ANIMADOS ============ */
function crearGlobos() {
  const colores = ["#d4af37", "#f6e27a", "#e84a8a", "#7b5cff", "#35c6d6", "#ffffff"];
  const contenedor = $("globos");
  const cantidad = window.innerWidth < 600 ? 8 : 14;
  for (let i = 0; i < cantidad; i++) {
    const g = document.createElement("div");
    g.className = "globo";
    g.style.left = Math.random() * 100 + "%";
    g.style.background = colores[i % colores.length];
    g.style.animationDuration = 14 + Math.random() * 14 + "s";
    g.style.animationDelay = -Math.random() * 20 + "s";
    g.style.transform = `scale(${0.7 + Math.random() * 0.8})`;
    contenedor.appendChild(g);
  }
}

/* ============ PARTÍCULAS DORADAS (fondo) ============ */
function iniciarParticulas() {
  const canvas = $("particulas");
  const ctx = canvas.getContext("2d");
  let ancho, alto, puntos = [];

  function ajustar() {
    ancho = canvas.width = window.innerWidth;
    alto = canvas.height = window.innerHeight;
    const n = Math.min(90, Math.floor(ancho / 14));
    puntos = Array.from({ length: n }, () => ({
      x: Math.random() * ancho, y: Math.random() * alto,
      r: Math.random() * 2 + .4, v: Math.random() * .5 + .15, f: Math.random() * Math.PI * 2
    }));
  }
  function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);
    puntos.forEach((p) => {
      p.y -= p.v; p.f += 0.03;
      if (p.y < -5) { p.y = alto + 5; p.x = Math.random() * ancho; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(246,226,122,${0.35 + Math.sin(p.f) * 0.3})`;
      ctx.shadowColor = "#d4af37"; ctx.shadowBlur = 8;
      ctx.fill();
    });
    requestAnimationFrame(dibujar);
  }
  ajustar();
  window.addEventListener("resize", ajustar);
  dibujar();
}

/* ============ CONFETI ============ */
const confeti = { canvas: null, ctx: null, piezas: [], activo: false };

function lanzarConfeti(cantidad) {
  const c = confeti;
  if (!c.canvas) {
    c.canvas = $("confeti");
    c.ctx = c.canvas.getContext("2d");
  }
  c.canvas.width = window.innerWidth;
  c.canvas.height = window.innerHeight;

  const colores = ["#d4af37", "#f6e27a", "#ffffff", "#e84a8a", "#7b5cff", "#35c6d6"];
  for (let i = 0; i < cantidad; i++) {
    c.piezas.push({
      x: window.innerWidth / 2 + (Math.random() - .5) * 200,
      y: window.innerHeight * 0.6,
      vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 6,
      w: Math.random() * 8 + 5, h: Math.random() * 5 + 3,
      rot: Math.random() * 360, vr: (Math.random() - .5) * 18,
      color: colores[Math.floor(Math.random() * colores.length)], vida: 1
    });
  }
  if (!c.activo) { c.activo = true; animarConfeti(); }
}

function animarConfeti() {
  const { ctx, canvas } = confeti;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confeti.piezas = confeti.piezas.filter((p) => p.vida > 0 && p.y < canvas.height + 20);

  confeti.piezas.forEach((p) => {
    p.vy += 0.35; p.vx *= 0.99;
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vida -= 0.004;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.globalAlpha = Math.max(p.vida, 0);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  if (confeti.piezas.length) requestAnimationFrame(animarConfeti);
  else { confeti.activo = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

/* ============ INICIO ============ */
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();
  crearGlobos();
  iniciarParticulas();
  actualizarContador();
  temporizador = setInterval(actualizarContador, 1000);

  $("btnAbrir").addEventListener("click", abrirInvitacion);
  $("btnSi").addEventListener("click", confirmarAsistencia);
  $("btnNo").addEventListener("click", rechazarAsistencia);
});