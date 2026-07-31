'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import KpiCards from './KpiCards'
import LeadTable from './LeadTable'
import AddLeadModal from './AddLeadModal'
import type { BetaLead } from '../../../../generated/prisma'

interface AdminDashboardProps {
  leads: BetaLead[]
  totalCount: number
  statMap: Record<string, number>
  currentSearch: string
  currentRole: string
  currentStatus: string
}

const STATUSES = ['ALL', 'HOLD', 'CONTACTED', 'ACTIVE', 'BLOCKED']
const STATUS_LABELS: Record<string, string> = {
  ALL: '🔵 All',
  HOLD: '⏳ Hold',
  CONTACTED: '📞 Contacted',
  ACTIVE: '✅ Active',
  BLOCKED: '🚫 Blocked',
}

export default function AdminDashboard({
  leads,
  totalCount,
  statMap,
  currentSearch,
  currentRole,
  currentStatus,
}: AdminDashboardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [searchInput, setSearchInput] = useState(currentSearch)

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v === '' || v === 'ALL') {
          params.delete(k)
        } else {
          params.set(k, v)
        }
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ search: searchInput })
  }

  const handleExportCSV = async () => {
    const res = await fetch('/api/admin/export', { credentials: 'include' })
    if (!res.ok) { alert('Export failed'); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apnatutorhub-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleModalClose = () => {
    setShowModal(false)
    router.refresh()
  }

  return (
    <>
      {/* Modal */}
      {showModal && <AddLeadModal onClose={handleModalClose} />}

      {/* Page title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
            Lead Management
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Early access applications & inquiries
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-sm"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            ➕ Add Lead Manually
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-secondary text-sm"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards totalCount={totalCount} statMap={statMap} />

      {/* Filters */}
      <div
        className="card p-4 mb-5 flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex gap-2"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="🔍  Search by name, area/locality, pincode, subject, language, city…"
            className="form-input flex-1"
            style={{ fontSize: '0.875rem' }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0.625rem 1rem', fontSize: '0.875rem', flexShrink: 0 }}
          >
            Search
          </button>
        </form>

        {/* Role filter */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Role:
          </span>
          {['ALL', 'PARENT', 'TUTOR'].map((r) => (
            <button
              key={r}
              onClick={() => updateParams({ role: r })}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={{
                background: currentRole === r ? 'var(--color-brand-green-muted)' : 'transparent',
                color: currentRole === r ? 'var(--color-brand-green-dark)' : 'var(--color-text-secondary)',
                borderColor: currentRole === r ? 'var(--color-brand-green-light)' : 'var(--color-border)',
              }}
            >
              {r === 'ALL' ? '🔵 All' : r === 'PARENT' ? '👨‍👩‍👧 Parents' : '👩‍🏫 Tutors'}
            </button>
          ))}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap mb-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {STATUSES.map((s) => {
          const count =
            s === 'ALL'
              ? totalCount
              : (statMap[s] ?? 0)
          const isActive = currentStatus === s
          return (
            <button
              key={s}
              onClick={() => updateParams({ status: s })}
              className="px-4 py-2.5 text-sm font-medium transition-all relative -mb-px"
              style={{
                color: isActive ? 'var(--color-brand-green-dark)' : 'var(--color-text-muted)',
                borderBottom: isActive ? '2px solid var(--color-brand-green)' : '2px solid transparent',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {STATUS_LABELS[s]}
              <span
                className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: isActive ? 'var(--color-brand-green-muted)' : 'var(--color-bg-subtle)',
                  color: isActive ? 'var(--color-brand-green-dark)' : 'var(--color-text-muted)',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Lead Table */}
      <LeadTable leads={leads} />
    </>
  )
}
