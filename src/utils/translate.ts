import { loadGroqKey } from './settings'

export async function translateToFrench(text: string): Promise<string> {
  const apiKey = loadGroqKey()
  if (!apiKey) throw new Error('No Groq API key set. Go to Settings to add one.')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 64,
      messages: [
        {
          role: 'system',
          content: 'You are a translator. Translate the given English word or phrase to French. Reply with only the French translation, nothing else.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(err)
  }

  const data = await response.json()
  return (data.choices[0].message.content as string).trim()
}
