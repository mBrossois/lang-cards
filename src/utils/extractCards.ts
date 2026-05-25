import type { StoredCard } from '../types'
import { loadGroqKey } from './settings'

export async function extractCardsFromImage(base64: string, mediaType: string): Promise<StoredCard[]> {
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
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mediaType};base64,${base64}` },
          },
          {
            type: 'text',
            text: `This is a page from a Dutch language textbook. Extract all vocabulary pairs where the English word or phrase is the original and the Dutch word or phrase is the translation.

Return ONLY a JSON array, no explanation, no markdown. Format:
[{"original":"<english>","translation":"<dutch>"},...]`,
          },
        ],
      }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(err)
  }

  const data = await response.json()
  const text: string = data.choices[0].message.content ?? ''
  const cleaned = text.replace(/^```json\s*|^```\s*|```$/gm, '').trim()
  const parsed: { original: string; translation: string }[] = JSON.parse(cleaned)
  const today = new Date().toISOString().slice(0, 10)
  return parsed.map((item) => ({ ...item, showIn: today }))
}
