
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


        const HF_TOKEN = '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';

        const MODEL = 'Qwen/Qwen2.5-7B-Instruct';

        const response = await fetch(
            `https://api-inference.huggingface.co/models/${MODEL}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: question,
                    parameters: {
                        max_new_tokens: 500,
                        temperature: 0.7,
                        return_full_text: false
                    }
                })
            }
        );

        if (response.status === 503) {
            const data = await response.json();
            if (data.error && data.error.includes('loading')) {
                return {
                    statusCode: 503,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Модель загружается, подождите 10-20 секунд и повторите запрос.' 
                    })
                };
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        const answer = data[0]?.generated_text || 'Не удалось получить ответ';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                result: { 
                    alternatives: [{ 
                        message: { 
                            text: answer 
                        } 
                    }] 
                } 
            })
        };
    } catch (error) {
        console.error('Hugging Face error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
