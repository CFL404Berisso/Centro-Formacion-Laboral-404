const courses = {
    curso1: {
        title: "Curso 1",
        description: "Descripción del Curso 1.",
        media: "https://ejemplo.com/imagen_curso1.jpg", // Puedes usar una URL de imagen o un enlace a un video de YouTube, por ejemplo.
        data: "Datos adicionales para el Curso 1.",
        link: "https://enlace-curso1.com"
    },
    curso2: {
        title: "Curso 2",
        description: "Descripción del Curso 2.",
        media: "https://ejemplo.com/video_curso2.mp4",
        data: "Datos adicionales para el Curso 2.",
        link: "https://enlace-curso2.com"
    },
    curso3: {
        title: "Curso 3",
        description: "Descripción del Curso 3.",
        media: "https://ejemplo.com/3.mp4",
        data: "Datos adicionales para el Curso 3.",
        link: "https://enlace-3.com"
    }
};


const popupContainer = document.getElementById('popupContainer');
const courseTitle = document.getElementById('courseTitle');
const courseDescription = document.getElementById('courseDescription');
const courseMedia = document.getElementById('courseMedia');
const courseData = document.getElementById('courseData');
const courseLink = document.getElementById('courseLink');
const openPopupButtons = document.querySelectorAll('.openPopup');
const closePopupButton = document.getElementById('closePopup');

openPopupButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const courseKey = button.getAttribute('data-course');
        const course = courses[courseKey];
        showPopup(course);
    });
});

closePopupButton.addEventListener('click', function() {
    hidePopup();
});

// Cierra el pop-up al hacer clic fuera de él (en el fondo oscuro)
window.addEventListener('click', function(event) {
    if (event.target === popupContainer) {
        hidePopup();
    }
});

function showPopup(course) {
    courseTitle.textContent = course.title;
    courseDescription.textContent = course.description;

    if (course.media.endsWith('.mp4')) {
        courseMedia.innerHTML = `<video width="100%" height="auto" controls><source src="${course.media}" type="video/mp4"></video>`;
    } else {
        courseMedia.innerHTML = `<img src="${course.media}" alt="Curso Media">`;
    }

    courseData.textContent = course.data;
    courseLink.href = course.link;
    popupContainer.style.display = 'flex';
}

function hidePopup() {
    popupContainer.style.display = 'none';
}