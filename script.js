const courses = {
    curso1: {
       media: "mecanica.html",
    },
    curso2: {
        media: "https://ejemplo.com/video_curso2.mp4",
    },
    curso3: {
        media: "https://ejemplo.com/3.mp4",
    }
};

const popupContainer = document.getElementById('popupContainer');
const courseMedia = document.getElementById('courseMedia');
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
    courseMedia.innerHTML = `<iframe src="${course.media}" width="100%" height="300" frameborder="0"></iframe>`;
    popupContainer.style.display = 'flex';
}

function hidePopup() {
    popupContainer.style.display = 'none';
}
