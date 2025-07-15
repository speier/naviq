"use client"

import { supabase } from "../lib/supabase"
import { config } from "../config"

const providerConfig = {
  google: { label: "Google", icon: "🔍" },
  github: { label: "GitHub", icon: "🐙" },
  discord: { label: "Discord", icon: "🎮" },
  facebook: { label: "Facebook", icon: "📘" },
}

export default function Login() {
  const handleLogin = async (provider: string) => {
    await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
      },
    })
  }

  const availableProviders = config.auth.providers.map(name => ({
    name,
    ...providerConfig[name as keyof typeof providerConfig]
  }))

  return (
    <div className="space-y-3 max-w-sm mx-auto mt-12">
      <h3 className="text-lg font-semibold text-center mb-4">Sign in to continue</h3>
      {availableProviders.map(({ name, label, icon }) => (
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
