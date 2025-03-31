document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide img');
    const titleElement = document.getElementById('gallery-title');
    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    const title = localStorage.getItem('galleryTitle') || 'Галерея';

    if (titleElement) titleElement.textContent = title;

    if (images.length === 3) {
        slides.forEach((img, index) => {
            img.src = images[index];  
            img.alt = ` ${title} + ' ' +${index + 1}`;
        });
    } else {
        console.error('Ошибка: изображения не загружены');
    }
});

let currentSlide = 0;

function changeSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + n + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = n;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}
