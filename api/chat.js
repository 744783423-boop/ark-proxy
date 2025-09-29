export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  const apiKey = process.env.ARK_API_KEY
  if (!apiKey) return new Response('Missing ARK_API_KEY', { status: 500 })

  const { scene, message, stream = true } = await req.json()
  const body = {
    model: 'bot-20250919144646-c877w',
    messages: [
      { role: 'system', content: `场景：${scene}` },
      { role: 'user', content: message }
    ],
    stream
  }

  const upstream = await fetch('https://ark.cn-beijing.volces.com/api/v3/bot_chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  })
}


