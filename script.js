const apiUrl = 'https://script.google.com/macros/s/AKfycbyNVS7_2H4giIyHE1OaaeZwMfjB-bGHa5hnaKzezilhRFaGkGSaGZ-m4NLrwnayNcoCEA/exec';

// Validación de edad
document.getElementById('edad').addEventListener('input', function () {
    const edad = parseInt(this.value);
    const errorSpan = document.getElementById('edad-error');
    if (edad < 16 || edad > 99) {
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
fetch(`${apiUrl}?cursos=true`)
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
                fechaNacimiento: document.getElementById('fecha-nacimiento').value,
                edad: document.getElementById('edad').value,
                direccion: document.getElementById('direccion').value,
                ciudad: document.getElementById('ciudad').value,
                celular: document.getElementById('celular').value,
                cuil: document.getElementById('cuil').value,
                estudios: document.getElementById('estudios').value,
                alumno: document.getElementById('alumno').value,
                conocimientos: document.getElementById('conocimientos').value,
                trabaja: document.getElementById('trabaja').value,
                planSocial: document.getElementById('plan-social').value,
                conociste: document.getElementById('conociste').value,
                curso: cursoSeleccionado,
                numeroInscripcion: parseInt(ultimaFila) + 1 // Agregar el número de inscripción
            };

            // Mostrar el número de inscripción antes de enviar
            alert('Su número de inscripción será: ' + datos.numeroInscripcion + "¿confirma su solicitud?");

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
                    alert("Solicitud confirmada!");
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
