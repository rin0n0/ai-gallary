let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function changeSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = n;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

if (document.querySelector('.slider')) {
    slides[0].classList.add('active');
    dots[0].classList.add('active');
}

const API_URL = 'https://nexra.aryahcr.cc/api/image/complements';
const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt-input');
const statusElement = document.getElementById('status');
const images = [];

if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            statusElement.textContent = 'Пожалуйста, введите описание';
            return;
        }

        generateBtn.disabled = true;
        statusElement.textContent = 'Генерация изображений...';

        try {     
            const image = await generateImage(prompt);
            
            for (let i = 0; i < 3; i++) { 
                images.push(image);
            }
            
     
            const galleryPage = window.open('gallery.html', '_blank');
            setTimeout(() => {
                const titleElement = galleryPage.document.getElementById('gallery-title');
                if (titleElement) {
                    titleElement.textContent = prompt;
                }      
                for (let i = 0; i < 3; i++) {
                    const imgElement = galleryPage.document.getElementById(`slide-${i+1}`);
                    if (imgElement) {
                        imgElement.src = images[i];
                        console.log('+img');
                    }
                }   
            }, 3000); 

        } catch (error) {
            console.error('Ошибка:', error);
            statusElement.textContent = 'Ошибка: ' + error.message;
        } finally {
            generateBtn.disabled = false;
        }
    });
}


async function generateImage(prompt) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            model: "stablediffusion-1.5",
            response: "base64"
        })
    });

    const data = await response.json();

    if (!data.id) {
        throw new Error('Слишком много запросов, попробуйте снова через 3 минуты');
    }

    const result = await waitForResult(data.id);

    if (result?.images && result.images['0']) {
        return result.images['0'];
    } else {
        throw new Error('Пустой ответ от API');
    }
}

async function waitForResult(taskId) {
    for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const response = await fetch(`${API_URL}/${encodeURIComponent(taskId)}`);
            const data = await response.json();
            console.log('Статус задачи:', data.status, data);
            if (data.status === 'completed') {
                return data;
            } else if (data.status === 'error') {
                throw new Error('Ошибка обработки задачи');
            }
        } catch (error) {
            if (i === 59) throw error;
        }
    }
    throw new Error('Превышено время ожидания');
}