document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.querySelector('.slides');
    const dotsContainer = document.querySelector('.dots');
    const titleElement = document.getElementById('gallery-title');

    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    const title = localStorage.getItem('galleryTitle') || 'Галерея';

    if (titleElement) titleElement.textContent = title;

    if (images.length > 0) {
        slidesContainer.innerHTML = '';
        dotsContainer.innerHTML = '';

        images.forEach((imgSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            if (index === 0) slide.classList.add('active');
            slide.innerHTML = `<img src="${imgSrc}" alt="Slide ${index + 1}">`;
            slidesContainer.appendChild(slide);

            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
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
