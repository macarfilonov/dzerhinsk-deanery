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

        const GROQ_API_KEY = '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';

        // Можно использовать разные модели:
        // 'llama-3.3-70b-versatile' - самая мощная (но лимит 1000 запросов/день)
        // 'mixtral-8x7b-32768' - хорошая, быстрая
        // 'gemma2-9b-it' - лёгкая, быстрая
        const MODEL = 'mixtral-8x7b-32768';

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
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
            throw new Error(`Groq API error: ${response.status} - ${errorText}`);
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
        console.error('Groq error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
