// Fecha objetivo: 1ro de Febrero de 2026 a las 00:00hs (horario de Argentina UTC-3)
const FECHA_OBJETIVO = new Date('2026-02-01T00:00:00-03:00').getTime();

// URL de WhatsApp (antes de la fecha)
const URL_WHATSAPP = 'https://api.whatsapp.com/send?phone=5492213192360';

// URL del formulario (después de la fecha)
const URL_FORMULARIO = 'FormInscripcion853.html';

// Función para verificar si ya pasó la fecha
function verificarFechaInscripcion() {
    const ahora = new Date().getTime();
    const diferencia = FECHA_OBJETIVO - ahora;
    
    // Si ya pasó la fecha, usar el formulario de inscripción
    if (diferencia <= 0) {
        return URL_FORMULARIO;
    }
    // Si aún no pasó, usar WhatsApp
    return URL_WHATSAPP;
}

// URL de inscripción que se actualiza automáticamente según la fecha
let INSCRIPCION_URL = verificarFechaInscripcion();

// Función para actualizar la URL cuando se cumpla la fecha (llamada desde otras páginas)
function actualizarURLInscripcion() {
    INSCRIPCION_URL = verificarFechaInscripcion();
    return INSCRIPCION_URL;
}

// Función para actualizar automáticamente los botones de inscripción en las páginas de cursos
function actualizarBotonesInscripcion() {
    // Verificar si ya pasó la fecha
    const ahora = new Date().getTime();
    const diferencia = FECHA_OBJETIVO - ahora;
    
    // Si ya pasó la fecha, actualizar los botones
    if (diferencia <= 0) {
        // Actualizar la URL primero
        actualizarURLInscripcion();
        
        // Buscar todos los botones con clase "mas_info"
        const botones = document.querySelectorAll('button.mas_info');
        
        let algunBotonActualizado = false;
        
        botones.forEach(boton => {
            // Verificar si el botón tiene el texto de "Disponible a partir..."
            const textoBoton = boton.textContent.trim();
            if (textoBoton.includes('Disponible a partir del 1ro de Febrero') || 
                textoBoton.includes('Disponible a partir')) {
                // Cambiar el texto directamente
                boton.textContent = 'Inscribite';
                
                // Buscar el enlace padre y actualizarlo
                const enlace = boton.closest('a');
                if (enlace) {
                    enlace.href = INSCRIPCION_URL;
                    enlace.style.cursor = 'pointer';
                    enlace.style.pointerEvents = 'auto';
                }
                
                // Habilitar el botón si está deshabilitado
                if (boton.disabled) {
                    boton.disabled = false;
                }
                
                algunBotonActualizado = true;
            }
        });
        
        // Si no hay botones para actualizar, no hacer nada (evita loops)
        return algunBotonActualizado;
    }
    
    return false;
}

// Contador global invisible que se ejecuta siempre (solo en páginas que no tienen contador visible)
let intervaloContadorGlobal = null;
let botonesYaActualizados = false;

function iniciarContadorGlobal() {
    // Verificar estado inicial y actualizar botones si es necesario
    const actualizados = actualizarBotonesInscripcion();
    if (actualizados) {
        botonesYaActualizados = true;
    }
    
    // Si ya pasó la fecha y los botones ya están actualizados, no hacer nada más
    const ahora = new Date().getTime();
    const diferencia = FECHA_OBJETIVO - ahora;
    if (diferencia <= 0 && botonesYaActualizados) {
        return;
    }
    
    // Solo iniciar contador si aún no pasó la fecha
    if (diferencia > 0) {
        // Iniciar contador que verifica cada segundo
        intervaloContadorGlobal = setInterval(() => {
            const ahora = new Date().getTime();
            const diferencia = FECHA_OBJETIVO - ahora;
            
            // Cuando llegue a 0, actualizar botones
            if (diferencia <= 0) {
                if (intervaloContadorGlobal) {
                    clearInterval(intervaloContadorGlobal);
                    intervaloContadorGlobal = null;
                }
                // Actualizar botones directamente (sin refresh para evitar loops)
                const actualizados = actualizarBotonesInscripcion();
                if (actualizados) {
                    botonesYaActualizados = true;
                }
            }
        }, 1000);
    }
}

// Solo ejecutar el contador global si NO estamos en index.html (que ya tiene su propio contador)
// Verificamos si existe el elemento del contador visible
if (!document.getElementById('countdown-container')) {
    // Ejecutar automáticamente cuando se carga la página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarContadorGlobal);
    } else {
        iniciarContadorGlobal();
    }
}
// En index.html no ejecutamos nada de config.js relacionado con contadores, 
// solo se usa para las funciones de URL