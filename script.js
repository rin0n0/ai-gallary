const API_URL = 'https://nexra.aryahcr.cc/api/image/complements';
const genButton = document.getElementById('gen-button');
const imgAi = document.getElementById('img-ai');

genButton.addEventListener('click', generateIMG);

async function generateIMG() {
    if (genButton.disabled) return;
    genButton.disabled = true;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: 'fat cat',
                model: "stablediffusion-1.5",
                response: "base64"
            })
        });
        
        const data = await response.json();
        
        if (!data.id) {
            throw new Error('Не получили ID задачи');
        }
        
        const result = await waitForResult(data.id);
        
        if (result?.images && result.images['0']) {
            imgAi.src = result.images['0'];
        } else {
            throw new Error('Пустой ответ от API или отсутствует изображение');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка: ' + error.message);
    } finally {
        genButton.disabled = false;
    }
}

async function waitForResult(taskId) {
    for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            const response = await fetch('https://nexra.aryahcr.cc/api/image/complements/' + encodeURIComponent(taskId));
            const data = await response.json();
            
            console.log('Статус задачи:', data.status, data);
            
            if (data.status === 'completed') {
                return data;
            } else if (data.status === 'error') {
                throw new Error('Ошибка обработки задачи');
            }
        } catch (error) {
            console.error('Ошибка проверки задачи:', error);
            if (i === 59) throw error;
        }
    }
    throw new Error('Превышено время ожидания');
}