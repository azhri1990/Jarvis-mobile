const express = require('express');
const app = express();
app.use(express.json());

// --- CONFIG ---
// Get your free key at https://console.groq.com
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'YOUR_GROQ_API_KEY_HERE';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });

    try {
        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [{ role: 'user', content: message }],
                temperature: 0.7
            })
        });
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || 'No response from AI.';
        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.json({ answer: 'JARVIS is offline. Check your internet.' });
    }
});

app.get('/health', (req, res) => res.send('OK'));

const PORT = 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ JARVIS running on port ${PORT}`);
    console.log(`📱 Local: http://localhost:${PORT}`);
});
