import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import AdminDashboard from './components/AdminDashboard'
import { adminLogout } from '@/lib/actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin CRM — ApnaTutorHub',
  description: 'Lead management dashboard for ApnaTutorHub early access',
}

// Disable caching so the admin page always shows fresh data
export const dynamic = 'force-dynamic'

interface SearchParams {
  search?: string
  role?: string
  status?: string
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const search = params.search?.trim() || ''
  const roleFilter = params.role || 'ALL'
  const statusFilter = params.status || 'ALL'

  // Build where clause
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { locality: { contains: search, mode: 'insensitive' } },
      { pincode: { contains: search, mode: 'insensitive' } },
      { subjects: { contains: search, mode: 'insensitive' } },
      { languages: { contains: search, mode: 'insensitive' } },
      { qualification: { contains: search, mode: 'insensitive' } },
      { preferredLocations: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (roleFilter !== 'ALL') {
    where.role = roleFilter
  }

  if (statusFilter !== 'ALL') {
    where.status = statusFilter
  }

  const [leads, stats] = await Promise.all([
    prisma.betaLead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.betaLead.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ])

  const totalCount = await prisma.betaLead.count()

  const statMap: Record<string, number> = {
    HOLD: 0,
    CONTACTED: 0,
    ACTIVE: 0,
    BLOCKED: 0,
  }
  stats.forEach((s) => {
    statMap[s.status] = s._count.id
  })

  return (
    <div
      className="min-h-dvh"
      style={{ background: 'var(--color-bg-page)' }}
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(240,253,244,0.9)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              A
            </div>
            <div>
              <span className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>
                ApnaTutorHub
              </span>
              <span
                className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--color-brand-green-muted)', color: 'var(--color-brand-green-dark)' }}
              >
                Admin CRM
              </span>
            </div>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="btn-secondary text-sm"
              style={{ padding: '0.4rem 0.875rem', fontSize: '0.8125rem' }}
            >
              🚪 Logout
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <Suspense fallback={<div className="text-center py-12 text-gray-400">Loading dashboard…</div>}>
          <AdminDashboard
            leads={leads}
            totalCount={totalCount}
            statMap={statMap}
            currentSearch={search}
            currentRole={roleFilter}
            currentStatus={statusFilter}
          />
        </Suspense>
      </main>
    </div>
  )
}
