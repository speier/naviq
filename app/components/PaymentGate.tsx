"use client"

import { useAuth } from "../lib/auth"
import Login from "./Login"
import { useState } from "react"

export default function PaymentGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  // Show login/register only if user clicks the button
  if (showLogin) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <button
          onClick={() => setShowLogin(false)}
          className="mb-4 text-blue-600 underline"
        >
          ← Back to Quiz
        </button>
        <Login />
      </div>
    )
  }

  // If logged in, show user info and logout
  if (user && !loading) {
    return (
      <div>
        <div className="flex items-center justify-end gap-3 mb-4">
          {user.user_metadata?.avatar_url && (
            <img src={user.user_metadata.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
          )}
          <span className="text-sm text-gray-700">{user.email}</span>
          <button
            onClick={signOut}
            className="text-xs text-blue-600 underline hover:text-blue-800"
          >
            Log out
          </button>
        </div>
        {children}
      </div>
    )
  }

  // Default: show quiz and a login/register option
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowLogin(true)}
          className="text-xs text-blue-600 underline hover:text-blue-800"
        >
          Login / Register
        </button>
      </div>
      {children}
    </div>
  )
}
