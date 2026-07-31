interface KpiCardsProps {
  totalCount: number
  statMap: Record<string, number>
}

const KPI_CONFIG = [
  {
    key: 'TOTAL',
    label: 'Total Leads',
    icon: '📊',
    bgColor: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
    borderColor: '#bbf7d0',
    valueColor: '#15803d',
  },
  {
    key: 'HOLD',
    label: 'On Hold',
    icon: '⏳',
    bgColor: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    borderColor: '#fde68a',
    valueColor: '#b45309',
  },
  {
    key: 'CONTACTED',
    label: 'Contacted',
    icon: '📞',
    bgColor: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    borderColor: '#bfdbfe',
    valueColor: '#1d4ed8',
  },
  {
    key: 'ACTIVE',
    label: 'Active',
    icon: '✅',
    bgColor: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
    borderColor: '#86efac',
    valueColor: '#16a34a',
  },
  {
    key: 'BLOCKED',
    label: 'Blocked',
    icon: '🚫',
    bgColor: 'linear-gradient(135deg, #fff5f5, #fee2e2)',
    borderColor: '#fecaca',
    valueColor: '#dc2626',
  },
]

export default function KpiCards({ totalCount, statMap }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {KPI_CONFIG.map((kpi) => {
        const count = kpi.key === 'TOTAL' ? totalCount : (statMap[kpi.key] ?? 0)
        return (
          <div
            key={kpi.key}
            className="rounded-xl p-4 border"
            style={{
              background: kpi.bgColor,
              borderColor: kpi.borderColor,
            }}
          >
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <div
              className="text-3xl font-extrabold"
              style={{ color: kpi.valueColor }}
            >
              {count}
            </div>
            <div
              className="text-xs font-medium mt-0.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {kpi.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
