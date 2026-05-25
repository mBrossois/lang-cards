import { useState } from 'react'
import { Eye, EyeOff, Check } from 'lucide-react'
import { loadGroqKey, saveGroqKey } from './utils/settings'

export default function Settings() {
  const [key, setKey] = useState(loadGroqKey)
  const [visible, setVisible] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    saveGroqKey(key.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-svh bg-gray-950 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-gray-400">Groq API key</label>
            <div className="relative">
              <input
                type={visible ? 'text' : 'password'}
                value={key}
                onChange={(e) => { setKey(e.target.value); setSaved(false) }}
                placeholder="gsk_…"
                autoComplete="off"
                className="w-full rounded-xl bg-gray-800 px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Used with Llama 4 Scout on Groq. Stored obfuscated in local storage — never sent anywhere except Groq.</p>
          </div>

          <button
            type="submit"
            className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 transition font-medium"
          >
            {saved && <Check size={16} />}
            {saved ? 'Saved' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
