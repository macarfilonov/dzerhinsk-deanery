// netlify/functions/groq-ai.js
// ЗАГЛУШКА – всегда возвращает фиксированный ответ

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
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Просто возвращаем фиктивный ответ
        const answer = '🤖 ИИ временно недоступен. Пожалуйста, попробуйте позже.';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                result: { alternatives: [{ message: { text: answer } }] }
            })
        };
    } catch (error) {
        console.error('Ошибка в groq-ai:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
