const apiUrl = 'https://script.google.com/macros/s/AKfycbym09XRUCE4pilI74HX8eE5y1NxdzFFi78cnNnrclW0gwBecA95XQVSuTsQbQBQiitPdg/exec';

// Seleccionar los elementos del DOM
const fechaNacimientoInput = document.getElementById('fechaNacimiento');
const edadInput = document.getElementById('edad');

// Función para calcular la edad
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    // Ajustar la edad si el cumpleaños no ha ocurrido este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

// Evento para calcular la edad automáticamente al cambiar la fecha de nacimiento
fechaNacimientoInput.addEventListener('change', function () {
    const fechaNacimiento = fechaNacimientoInput.value;
    if (fechaNacimiento) {
        const edad = calcularEdad(fechaNacimiento);
        edadInput.value = edad;
    }
});

// Validación de edad
document.getElementById('edad').addEventListener('input', function () {
    const edad = parseInt(this.value);
    const errorSpan = document.getElementById('edad-error');
    if (edad < 15 || edad > 99) {
        errorSpan.style.display = 'block';
    } else {
        errorSpan.style.display = 'none';
    }
});

// Función para obtener la última fila del curso seleccionado
function obtenerUltimaFilaDelCurso(cursoSeleccionado) {
    return fetch(`${apiUrl}?ultimaFila=true&curso=${encodeURIComponent(cursoSeleccionado)}`)
        .then(response => response.json())
        .then(data => {
            if (data.ultimaFila) {
                return data.ultimaFila; // Devuelve la última fila si existe
            } else {
                console.error('No se encontró la última fila en la respuesta.');
                return null;
            }
        })
        .catch(error => {
            console.error('Error al obtener la última fila:', error);
            return null;
        });
}

// Cargar los cursos desde Google Sheets
/*fetch(`${apiUrl}?cursos=true`)
    .then(response => response.json())
    .then(cursos => {
        const cursoSelect = document.getElementById('curso');
        cursos.forEach(function (curso) {
            const option = document.createElement('option');
            option.value = curso;
            option.text = curso;
            cursoSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar los cursos:', error));*/

// Cargar los cursos desde Google Sheets
fetch(`${apiUrl}?cursos=true`)
    .then(response => response.json())
    .then(cursos => {
        const cursoSelect = document.getElementById('curso');
        const descripcionParrafo = document.getElementById('descripcion-curso'); // Selecciona el <p> donde se mostrará la descripción

        // Cargar los cursos en el select
        cursos.forEach(function (curso) {
            const option = document.createElement('option');
            option.value = curso.nombre;
            option.text = curso.nombre;
            option.setAttribute('data-descripcion', curso.descripcion || ''); // Guardamos la descripción en un atributo data-descripcion
            cursoSelect.appendChild(option);
        });

        // Actualizar la descripción cuando cambie el curso
        cursoSelect.addEventListener('change', function () {
            const cursoSeleccionado = cursoSelect.options[cursoSelect.selectedIndex];
            const descripcion = cursoSeleccionado.getAttribute('data-descripcion');

            // Actualiza el contenido del párrafo con la descripción
            descripcionParrafo.innerHTML = descripcion ? `Descripción del curso:<br> ${descripcion}` : 'No hay descripción disponible.';
        });
    })
    .catch(error => console.error('Error al cargar los cursos:', error));

// Enviar los datos del formulario a Google Sheets
document.getElementById('inscripcion-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const cursoSeleccionado = document.getElementById('curso').value;

    // Obtener la última fila del curso antes de enviar los datos
    obtenerUltimaFilaDelCurso(cursoSeleccionado).then(ultimaFila => {
        if (ultimaFila !== null) {
            // Recolectar datos del formulario
            const datos = {
                email: document.getElementById('email').value,
                apellido: document.getElementById('apellido').value,
                nombre: document.getElementById('nombre').value,
                dni: document.getElementById('dni').value,
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
                edad: document.getElementById('edad').value,
                direccion: document.getElementById('direccion').value,
                ciudad: document.getElementById('ciudad').value,
                celular: document.getElementById('celular').value,
                cuil: document.getElementById('cuil').value,
                estudios: document.getElementById('estudios').value,
                alumno: document.getElementById('alumno').value,
                conocimientos: document.getElementById('conocimientos').value,
                conocimientosEspecifique: document.getElementById('conocimientos-especifique').value || '', // Solo si está visible 
                trabaja: document.getElementById('trabaja').value,
                planSocial: document.getElementById('plan-social').value,
                planSocialEspecifique: document.getElementById('plan-social-especifique').value || '', // Solo si está visible
                conociste: document.getElementById('conociste').value,
                curso: cursoSeleccionado,
                numeroInscripcion: parseInt(ultimaFila)  // Agregar el número de inscripción
            };

            // Mostrar el número de inscripción antes de enviar
            alert('Su número de inscripción será: ' + datos.numeroInscripcion + ". ¿confirma su solicitud?");

            // Enviar datos a Google Sheets (sin el parámetro cursos=true)
            try {
                fetch(apiUrl, {
                    method: 'POST',
                    body: JSON.stringify(datos),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'no-cors'
                })
                    .then(response => {
                        console.log("Datos enviados");
                        alert('Su número de inscripción es: ' + datos.numeroInscripcion + " Recorda que te llegará un mail con los pasos a seguir.(Se envía al mail declarado en el formulario).");
                        // Reiniciar el formulario después de la confirmación
                        window.location.reload();
                    })
                    .catch(error => {
                        console.error('Error al enviar los datos:', error);
                    });
            } catch (error) {
                console.error(error);
                alert('Hubo un problema al enviar tu inscripción. Por favor, intenta nuevamente.');
            }
        } else {
            alert('No se pudo obtener el número de inscripción.');
        }
    });
});


// Obtener todos los campos y los spans de error
const inputs = document.querySelectorAll('#inscripcion-form input');
const selects = document.querySelectorAll('#inscripcion-form select');
const errorMessages = {
    email: 'Por favor, ingresa un correo electrónico válido.',
    apellido: 'El apellido debe tener entre 2 y 50 caracteres y solo contener letras.',
    nombre: 'El nombre debe tener entre 2 y 50 caracteres y solo contener letras.',
    dni: 'El DNI debe tener entre 7 y 8 dígitos numéricos.',
    fechaNacimiento: 'Si usted es menor de 16 años no puede inscribirse. Por favor, ingrese una fecha válida.',
    edad: 'Por favor, ingresa una edad entre 16 y 99 años.',
    direccion: 'La dirección debe tener entre 5 y 100 caracteres.',
    ciudad: 'La ciudad debe tener entre 2 y 50 caracteres y solo contener letras.',
    celular: 'Por favor, ingresa un número de teléfono válido (entre 7 y 15 dígitos).',
    cuil: 'El CUIL debe tener 11 dígitos.',
    estudios: 'Este campo debe tener entre 2 y 50 caracteres.',
    alumno: 'Por favor, selecciona una opción.',
    conocimientos: 'Por favor, selecciona si tienes conocimientos.',
    trabaja: 'Por favor, selecciona si trabajas.',
    'plan-social': 'Por favor, selecciona si posees plan social.',
    conociste: 'Por favor, selecciona cómo nos conociste.'
};

// Función para validar los campos de input
function validarCampo(input) {
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (!input.checkValidity()) {
        errorSpan.textContent = errorMessages[input.id];
        errorSpan.style.display = 'block';
    } else {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
    }
}

// Función para validar los campos de select
function validarSelect(select) {
    const errorSpan = document.getElementById(`${select.id}-error`);
    if (select.value === "") {
        errorSpan.textContent = errorMessages[select.id];
        errorSpan.style.display = 'block';
    } else {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
    }
}

// Mostrar u ocultar campos adicionales según la selección
const conocimientosSelect = document.getElementById('conocimientos');
const conocimientosEspecifique = document.getElementById('conocimientos-especifique-container');
const planSocialSelect = document.getElementById('plan-social');
const planSocialEspecifique = document.getElementById('plan-social-especifique-container');

// Manejar la lógica para mostrar campos adicionales
conocimientosSelect.addEventListener('change', function () {
    if (this.value === 'sí') {
        conocimientosEspecifique.style.display = 'block';
    } else {
        conocimientosEspecifique.style.display = 'none';
    }
});

planSocialSelect.addEventListener('change', function () {
    if (this.value === 'sí') {
        planSocialEspecifique.style.display = 'block';
    } else {
        planSocialEspecifique.style.display = 'none';
    }
});

// Validar cada campo input al perder el foco
inputs.forEach(input => {
    input.addEventListener('input', () => validarCampo(input));
});

// Validar cada campo select al cambiar su valor
selects.forEach(select => {
    select.addEventListener('change', () => validarSelect(select));
});

// Validar todos los campos al enviar el formulario
document.getElementById('inscripcion-form').addEventListener('submit', function (e) {
    inputs.forEach(input => validarCampo(input));
    selects.forEach(select => validarSelect(select));

    // Verificar la validez general del formulario antes de enviarlo
    if (!this.checkValidity()) {
        e.preventDefault();  // Evitar el envío del formulario si hay errores
    }
});

