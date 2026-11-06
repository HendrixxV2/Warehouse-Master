const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const TIMEOUT_MS = 15_000;

async function ask(prompt, options = {}) {
  const { system, model, jsonMode = false, temperature, maxTokens } = options;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) return { source: 'fallback', text: null };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const body = {
      model: model || process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: prompt },
      ],
    };

    if (jsonMode) body.response_format = { type: 'json_object' };
    if (typeof temperature === 'number') body.temperature = temperature;
    if (typeof maxTokens === 'number') body.max_tokens = maxTokens;

    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) return { source: 'fallback', text: null };

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text ? { source: 'deepseek', text } : { source: 'fallback', text: null };
  } catch (_) {
    return { source: 'fallback', text: null };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { ask };
