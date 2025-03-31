const API_URL = 'https://nexra.aryahcr.cc/api/image/complements';
const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt-input');
const statusElement = document.getElementById('status');

if (generateBtn) {
    console.log('starting..')
    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            statusElement.textContent = 'Пожалуйста, введите описание';
            return;
        }

        generateBtn.disabled = true;
        statusElement.textContent = '(0/3) Генерация изображений...';
        const images = [];
        try {         
            for (let i = 0; i < 3; i++) {
                const image = await generateImage(prompt+i);
                images.push(image);
                statusElement.textContent = '('+(i+1)+'/3) Генерация изображений...';
            }


            localStorage.setItem('galleryImages', JSON.stringify(images));
            localStorage.setItem('galleryTitle', prompt);


            window.open('gallery.html');

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: prompt,
            model: "stablediffusion-1.5",
            response: "base64"
        })
    });

    const data = await response.json();
    if (!data.id) throw new Error('Слишком много запросов, попробуйте снова через 3 минуты');

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
            console.log(data.status);
            if (data.status === 'completed') return data;
            if (data.status === 'error') throw new Error('Ошибка обработки задачи');
        } catch (error) {
            if (i === 59) throw error;
        }
    }
    throw new Error('Превышено время ожидания');
}
