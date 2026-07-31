'use client'

import { useActionState } from 'react'
import { adminLogin, type ActionState } from '@/lib/actions'

const initialState: ActionState = { success: false }

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState)

  return (
    <main
      className="min-h-dvh flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg-page)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
          >
            A
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
            ApnaTutorHub
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Admin CRM Dashboard
          </p>
        </div>

        <div className="card p-7">
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Admin Login
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Enter your admin passcode to access the CRM.
          </p>

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="passcode"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Admin Passcode
              </label>
              <input
                id="passcode"
                name="passcode"
                type="password"
                placeholder="Enter passcode"
                required
                autoComplete="current-password"
                disabled={pending}
                className="form-input"
              />
            </div>

            {state.error && (
              <div
                className="rounded-xl p-3.5 flex items-center gap-2"
                style={{ background: '#fee2e2', border: '1px solid #fecaca' }}
              >
                <span>🔐</span>
                <p className="text-sm font-medium" style={{ color: '#991b1b' }}>
                  {state.error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full"
              style={{ padding: '0.75rem', fontSize: '0.9375rem' }}
            >
              {pending ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying…
                </>
              ) : (
                '🔑 Enter Dashboard'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
          This area is restricted to ApnaTutorHub team members only.
        </p>
      </div>
    </main>
  )
}
