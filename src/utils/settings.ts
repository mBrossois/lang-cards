const GROQ_KEY = 'lang-cards:groq-key'

export function loadGroqKey(): string {
  const raw = localStorage.getItem(GROQ_KEY)
  if (!raw) return ''
  try {
    return atob(raw)
  } catch {
    return ''
  }
}

export function saveGroqKey(key: string) {
  if (key) {
    localStorage.setItem(GROQ_KEY, btoa(key))
  } else {
    localStorage.removeItem(GROQ_KEY)
  }
}
