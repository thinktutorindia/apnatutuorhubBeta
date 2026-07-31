import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  // Auth check
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  const secret = process.env.ADMIN_SESSION_SECRET ?? 'secret'

  if (!session || session.value !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const leads = await prisma.betaLead.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Role',
    'City',
    'Locality / Area',
    'Pincode',
    'Preferred Travel Locations',
    'Languages',
    'Status',
    'Qualification',
    'Experience',
    'Subjects',
    'Teaching Mode',
    'Student Grade',
    'Budget',
    'Address',
    'Documents Status',
    'Documents Notes',
    'Notes / Requirement',
    'Admin Notes',
    'Created At',
    'Updated At',
  ]

  const escape = (val: string | null | undefined): string => {
    if (val == null) return ''
    const str = String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const rows = leads.map((l) =>
    [
      escape(l.id),
      escape(l.name),
      escape(l.email),
      escape(l.phone),
      escape(l.role),
      escape(l.city),
      escape(l.locality),
      escape(l.pincode),
      escape(l.preferredLocations),
      escape(l.languages),
      escape(l.status),
      escape(l.qualification),
      escape(l.experience),
      escape(l.subjects),
      escape(l.teachingMode),
      escape(l.studentGrade),
      escape(l.budget),
      escape(l.address),
      escape(l.documentsStatus),
      escape(l.documentsNotes),
      escape(l.notes),
      escape(l.adminNotes),
      escape(l.createdAt.toISOString()),
      escape(l.updatedAt.toISOString()),
    ].join(',')
  )

  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="apnatutorhub-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
