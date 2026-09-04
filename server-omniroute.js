const express = require('express');
const { OmniRoute } = require('omniroute');
const app = express();
app.use(express.json());

const omni = new OmniRoute({
    preferences: { compression: true }
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await omni.chat({
            messages: [{ role: 'user', content: message }],
            provider: 'auto'
        });
        res.json({ answer: response.content });
    } catch (error) {
        res.json({ answer: 'JARVIS is thinking but offline.' });
    }
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(8000, '0.0.0.0', () => {
    console.log('✅ JARVIS with OmniRoute running on port 8000');
});
