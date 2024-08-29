// Validación de edad
document.getElementById('edad').addEventListener('input', function() {
    const edad = parseInt(this.value);
    const errorSpan = document.getElementById('edad-error');
    if (edad < 16 || edad > 99) {
        errorSpan.style.display = 'block';
    } else {
        errorSpan.style.display = 'none';
    }
});

// Cargar los cursos desde Google Sheets
fetch('https://script.google.com/macros/s/AKfycbw145n0jEdIQj6S05E_6tsL7M5Sua79-ARCQnC4LjCdKGIES-ubIC3ezQfgomOZWd2FMQ/exec?cursos=true')
    .then(response => response.json())
    .then(cursos => {
        const cursoSelect = document.getElementById('curso');
        cursos.forEach(function(curso) {
            const option = document.createElement('option');
            option.value = curso;
            option.text = curso;
            cursoSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar los cursos:', error));

// Enviar los datos del formulario a Google Sheets
document.getElementById('inscripcion-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
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
        curso: document.getElementById('curso').value
    };

    // Enviar datos a Google Sheets (sin el parámetro cursos=true)
    fetch('https://script.google.com/macros/s/AKfycbw145n0jEdIQj6S05E_6tsL7M5Sua79-ARCQnC4LjCdKGIES-ubIC3ezQfgomOZWd2FMQ/exec', {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Inscripción realizada con éxito. Número de inscripción: ' + data.numeroInscripcion);
    })
    .catch(error => console.error('Error al enviar los datos:', error));
});
