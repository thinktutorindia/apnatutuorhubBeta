'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Type re-export for use in components
export type { BetaLead } from '../generated/prisma'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type ActionState = {
  success: boolean
  error?: string
  duplicate?: boolean
  message?: string
}

// ─────────────────────────────────────────────
// PUBLIC: Submit Early Access Lead
// ─────────────────────────────────────────────
export async function submitLead(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const phone = (formData.get('phone') as string)?.trim()
  const role = (formData.get('role') as string)?.trim()
  const city = (formData.get('city') as string)?.trim()
  const notes = (formData.get('notes') as string)?.trim() || null

  // Validation
  if (!name || !email || !phone || !role || !city) {
    return { success: false, error: 'All required fields must be filled.' }
  }
  if (!/^\d{10}$/.test(phone)) {
    return { success: false, error: 'Phone number must be exactly 10 digits.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }
  if (!['PARENT', 'TUTOR'].includes(role)) {
    return { success: false, error: 'Invalid role selected.' }
  }

  // Duplicate check
  const existing = await prisma.betaLead.findFirst({
    where: { OR: [{ email }, { phone }] },
  })
  if (existing) {
    return {
      success: false,
      duplicate: true,
      error:
        'An early access request with this email/phone already exists. Our team will contact you soon!',
    }
  }

  try {
    await prisma.betaLead.create({
      data: { name, email, phone, role, city, notes },
    })
    return {
      success: true,
      message:
        'Thank you for joining ApnaTutorHub Early Access! Our onboarding team will call you shortly.',
    }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

// ─────────────────────────────────────────────
// ADMIN: Login
// ─────────────────────────────────────────────
export async function adminLogin(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const passcode = (formData.get('passcode') as string)?.trim()
  const expected = process.env.ADMIN_PASSCODE

  if (!passcode || passcode !== expected) {
    return { success: false, error: 'Invalid passcode. Please try again.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', process.env.ADMIN_SESSION_SECRET ?? 'secret', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })

  redirect('/admin')
}

// ─────────────────────────────────────────────
// ADMIN: Logout
// ─────────────────────────────────────────────
export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}

// ─────────────────────────────────────────────
// ADMIN: Add Lead Manually
// ─────────────────────────────────────────────
export async function addLeadManually(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const phone = (formData.get('phone') as string)?.trim()
  const role = (formData.get('role') as string)?.trim()
  const city = (formData.get('city') as string)?.trim()
  const notes = (formData.get('notes') as string)?.trim() || null
  const status = (formData.get('status') as string)?.trim() || 'HOLD'

  // Extended fields
  const qualification = (formData.get('qualification') as string)?.trim() || null
  const experience = (formData.get('experience') as string)?.trim() || null
  const subjects = (formData.get('subjects') as string)?.trim() || null
  const teachingMode = (formData.get('teachingMode') as string)?.trim() || null
  const studentGrade = (formData.get('studentGrade') as string)?.trim() || null
  const budget = (formData.get('budget') as string)?.trim() || null
  const address = (formData.get('address') as string)?.trim() || null
  const locality = (formData.get('locality') as string)?.trim() || null
  const pincode = (formData.get('pincode') as string)?.trim() || null
  const preferredLocations = (formData.get('preferredLocations') as string)?.trim() || null
  const languages = (formData.get('languages') as string)?.trim() || null
  const documentsStatus = (formData.get('documentsStatus') as string)?.trim() || 'PENDING'
  const documentsNotes = (formData.get('documentsNotes') as string)?.trim() || null

  if (!name || !email || !phone || !role || !city) {
    return { success: false, error: 'All required fields must be filled.' }
  }
  if (!/^\d{10}$/.test(phone)) {
    return { success: false, error: 'Phone number must be exactly 10 digits.' }
  }

  const existing = await prisma.betaLead.findFirst({
    where: { OR: [{ email }, { phone }] },
  })
  if (existing) {
    return {
      success: false,
      duplicate: true,
      error: 'A lead with this email or phone already exists.',
    }
  }

  try {
    await prisma.betaLead.create({
      data: {
        name,
        email,
        phone,
        role,
        city,
        notes,
        status,
        qualification,
        experience,
        subjects,
        teachingMode,
        studentGrade,
        budget,
        address,
        locality,
        pincode,
        preferredLocations,
        languages,
        documentsStatus,
        documentsNotes,
      },
    })
    revalidatePath('/admin')
    return { success: true, message: 'Lead added successfully.' }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

// ─────────────────────────────────────────────
// ADMIN: Update Lead Status
// ─────────────────────────────────────────────
export async function updateLeadStatus(
  id: string,
  status: string
): Promise<{ success: boolean }> {
  try {
    await prisma.betaLead.update({
      where: { id },
      data: { status },
    })
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return { success: false }
  }
}

// ─────────────────────────────────────────────
// ADMIN: Update Admin Notes
// ─────────────────────────────────────────────
export async function updateAdminNotes(
  id: string,
  adminNotes: string
): Promise<{ success: boolean }> {
  try {
    await prisma.betaLead.update({
      where: { id },
      data: { adminNotes },
    })
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return { success: false }
  }
}

// ─────────────────────────────────────────────
// ADMIN: Update Full Lead Profile & Verification Details
// ─────────────────────────────────────────────
export async function updateLeadDetails(
  id: string,
  data: {
    qualification?: string | null
    experience?: string | null
    subjects?: string | null
    teachingMode?: string | null
    studentGrade?: string | null
    budget?: string | null
    address?: string | null
    locality?: string | null
    pincode?: string | null
    preferredLocations?: string | null
    languages?: string | null
    documentsStatus?: string | null
    documentsNotes?: string | null
    notes?: string | null
    adminNotes?: string | null
    city?: string | null
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.betaLead.update({
      where: { id },
      data: {
        ...(data.qualification !== undefined && { qualification: data.qualification }),
        ...(data.experience !== undefined && { experience: data.experience }),
        ...(data.subjects !== undefined && { subjects: data.subjects }),
        ...(data.teachingMode !== undefined && { teachingMode: data.teachingMode }),
        ...(data.studentGrade !== undefined && { studentGrade: data.studentGrade }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.locality !== undefined && { locality: data.locality }),
        ...(data.pincode !== undefined && { pincode: data.pincode }),
        ...(data.preferredLocations !== undefined && { preferredLocations: data.preferredLocations }),
        ...(data.languages !== undefined && { languages: data.languages }),
        ...(data.documentsStatus !== undefined && { documentsStatus: data.documentsStatus }),
        ...(data.documentsNotes !== undefined && { documentsNotes: data.documentsNotes }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.adminNotes !== undefined && { adminNotes: data.adminNotes }),
        ...(data.city != null && { city: data.city }),
      },
    })
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update lead profile.' }
  }
}
