'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin Dashboard Error:', error)
  }, [error])

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-slate-900 text-white">
      <div className="max-w-md w-full text-center p-8 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          Unable to Load Admin CRM
        </h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {error.message || 'A database or network error occurred while fetching dashboard data.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg"
          >
            🔄 Reload Dashboard
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-sm transition-all"
          >
            🏠 Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
