import type { StoredCard } from '../types'

export const STORAGE_KEY = 'lang-cards'

export function loadCards(): StoredCard[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveCards(cards: StoredCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}
