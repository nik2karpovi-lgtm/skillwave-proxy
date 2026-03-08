export default async function handler(req, res) {
// Разрешаем CORS — чтобы Tilda могла обращаться к нашему серверу
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);

// Preflight запрос
if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).json({ error: ‘Method not allowed’ });

const { messages, system } = req.body;

if (!messages || !Array.isArray(messages)) {
return res.status(400).json({ error: ‘messages обязателен’ });
}

try {
const response = await fetch(‘https://api.anthropic.com/v1/messages’, {
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’,
‘x-api-key’: process.env.ANTHROPIC_API_KEY, // ключ хранится на сервере
‘anthropic-version’: ‘2023-06-01’
},
body: JSON.stringify({
model: ‘claude-sonnet-4-20250514’,
max_tokens: 600,
system: system || ‘Ты AI-ментор курса по SMM и маркетингу. Отвечай на русском, кратко и по делу.’,
messages
})
});

```
const data = await response.json();

if (!response.ok) {
  return res.status(response.status).json({ error: data });
}

return res.status(200).json({ reply: data.content[0].text });
```

} catch (err) {
return res.status(500).json({ error: ’Ошибка сервера: ’ + err.message });
}
}
