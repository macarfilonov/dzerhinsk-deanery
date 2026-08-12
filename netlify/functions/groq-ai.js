// netlify/functions/groq-ai.js
exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method Not Allowed' };

    try {
        const { question } = JSON.parse(event.body);
        if (!question) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Вопрос не задан' }) };
        }

        // Ваш ключ OpenRouter
        const OPENROUTER_API_KEY = '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';

        // Модели Groq через OpenRouter:
        // 'groq/mixtral-8x7b-32768' — хорошая, быстрая
        // 'groq/llama-3.3-70b-versatile' — мощная
        // 'groq/gemma2-9b-it' — лёгкая
        // Также можно использовать другие модели: 'openai/gpt-3.5-turbo', 'anthropic/claude-3-haiku' и т.д.
        const MODEL = 'groq/mixtral-8x7b-32768';

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                // Опционально: идентификатор вашего сайта для OpenRouter
                'HTTP-Referer': 'https://ваш-сайт.netlify.app',
                'X-Title': 'Дзержинское благочиние'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: question }],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || 'Не удалось получить ответ';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                result: { alternatives: [{ message: { text: answer } }] }
            })
        };
    } catch (error) {
        console.error('OpenRouter error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
