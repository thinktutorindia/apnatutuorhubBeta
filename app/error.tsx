'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-slate-50 text-slate-900">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-xl">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ⚡
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {error.message || 'We could not process your request at this moment. Please try again.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md"
          >
            🔄 Try Again
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
          >
            🏠 Return Home
          </a>
        </div>
      </div>
    </div>
  )
}
