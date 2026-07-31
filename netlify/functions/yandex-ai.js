exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Метод не разрешён. Используйте POST.' })
        };
    }

    try {
        const { question } = JSON.parse(event.body);
        if (!question || question.trim() === '') {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Вопрос не может быть пустым.' }) };
        }

        const API_KEY = 'AQVN0Yi2ZXsQBGxx0qGOW4Gmm5ptMWdhl3yD-gIQ';
        const FOLDER_ID = 'b1grgek3bgbqc3vagodq';

        const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
            method: 'POST',
            headers: {
                'Authorization': `Api-Key ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                modelUri: `gpt://${FOLDER_ID}/yandexgpt-lite`,
                completionOptions: {
                    stream: false,
                    temperature: 0.6,
                    maxTokens: 1000
                },
                messages: [{ role: 'user', text: question }]
            })
        });

        const data = await response.json();
        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Ошибка в функции:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Внутренняя ошибка сервера' })
        };
    }
};
