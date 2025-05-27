"use client"

import { supabase } from "../lib/supabase"

const providers = [
  { name: "google", label: "Google", icon: "🔍" },
  { name: "github", label: "GitHub", icon: "🐙" },
  { name: "discord", label: "Discord", icon: "🎮" },
  { name: "facebook", label: "Facebook", icon: "📘" },
]

export default function Login() {
  const handleLogin = async (provider: string) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
      },
    })
  }

  return (
    <div className="space-y-3 max-w-sm mx-auto mt-12">
      <h3 className="text-lg font-semibold text-center mb-4">Sign in to continue</h3>
      {providers.map(({ name, label, icon }) => (
        <button
          key={name}
          onClick={() => handleLogin(name)}
          className="w-full flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
        >
          <span className="text-xl">{icon}</span>
          Continue with {label}
        </button>
      ))}
    </div>
  )
}
