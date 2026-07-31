'use client'

import { useState, useTransition, useRef, useCallback } from 'react'
import { updateLeadStatus, updateAdminNotes, updateLeadDetails } from '@/lib/actions'
import type { BetaLead } from '@/generated/prisma'

interface LeadTableProps {
  leads: BetaLead[]
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: string; bg: string; color: string; border: string }
> = {
  HOLD: {
    label: 'Hold',
    icon: '⏳',
    bg: '#fef3c7',
    color: '#92400e',
    border: '#fde68a',
  },
  CONTACTED: {
    label: 'Contacted',
    icon: '📞',
    bg: '#dbeafe',
    color: '#1e40af',
    border: '#bfdbfe',
  },
  ACTIVE: {
    label: 'Active',
    icon: '✅',
    bg: '#dcfce7',
    color: '#166534',
    border: '#86efac',
  },
  BLOCKED: {
    label: 'Blocked',
    icon: '🚫',
    bg: '#fee2e2',
    color: '#991b1b',
    border: '#fecaca',
  },
}

const DOC_STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  PENDING: { label: '⏳ Verification Pending', bg: '#fef3c7', color: '#b45309' },
  VERIFIED: { label: '✅ Docs Verified', bg: '#dcfce7', color: '#15803d' },
  REJECTED: { label: '❌ Docs Rejected', bg: '#fee2e2', color: '#b91c1c' },
  NOT_REQUIRED: { label: '⚪ Not Required', bg: '#f1f5f9', color: '#64748b' },
}

const CLASS_CATEGORIES = [
  { id: '1-5', label: '1 - 5' },
  { id: '6-10', label: '6 - 10' },
  { id: '11-12', label: '11 - 12' },
  { id: 'NEET/JEE', label: 'NEET/JEE' },
]

const LANGUAGE_OPTIONS = [
  'English',
  'Hindi',
  'Marathi',
  'English & Hindi (Hinglish)',
  'English, Hindi & Marathi',
  'Gujarati',
  'Kannada',
  'Tamil',
  'Telugu',
  'Other / Custom',
]

function LeadRow({ lead }: { lead: BetaLead }) {
  const [currentStatus, setCurrentStatus] = useState(lead.status)
  const [notes, setNotes] = useState(lead.adminNotes ?? '')
  const [savedNotes, setSavedNotes] = useState(lead.adminNotes ?? '')
  const [savingNotes, setSavingNotes] = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)
  const [statusPending, startStatusTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [expanded, setExpanded] = useState(false)

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileForm, setProfileForm] = useState({
    city: lead.city ?? '',
    locality: lead.locality ?? '',
    pincode: lead.pincode ?? '',
    preferredLocations: lead.preferredLocations ?? '',
    languages: lead.languages ?? 'English & Hindi (Hinglish)',
    qualification: lead.qualification ?? '',
    experience: lead.experience ?? '',
    subjects: lead.subjects ?? '',
    teachingMode: lead.teachingMode ?? 'Both',
    studentGrade: lead.studentGrade ?? '',
    budget: lead.budget ?? '',
    address: lead.address ?? '',
    documentsStatus: lead.documentsStatus ?? 'PENDING',
    documentsNotes: lead.documentsNotes ?? '',
    notes: lead.notes ?? '',
  })

  // Class category checkboxes state
  const [selectedClasses, setSelectedClasses] = useState<string[]>(() => {
    const existingGrade = lead.studentGrade ?? ''
    return CLASS_CATEGORIES.filter((c) => existingGrade.includes(c.id)).map((c) => c.id)
  })

  const handleClassToggle = (id: string) => {
    const nextClasses = selectedClasses.includes(id)
      ? selectedClasses.filter((item) => item !== id)
      : [...selectedClasses, id]
    setSelectedClasses(nextClasses)

    // Automatically update studentGrade string with selected class range badges
    const baseText = profileForm.studentGrade.replace(/\[Classes:[^\]]*\]/g, '').trim()
    const classTag = nextClasses.length > 0 ? `[Classes: ${nextClasses.join(', ')}]` : ''
    const updatedGrade = [classTag, baseText].filter(Boolean).join(' ')
    setProfileForm((prev) => ({ ...prev, studentGrade: updatedGrade }))
  }

  const handleStatusChange = (newStatus: string) => {
    const prev = currentStatus
    setCurrentStatus(newStatus)
    startStatusTransition(async () => {
      const result = await updateLeadStatus(lead.id, newStatus)
      if (!result.success) setCurrentStatus(prev)
    })
  }

  const handleNotesChange = useCallback(
    (value: string) => {
      setNotes(value)
      setNotesSaved(false)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        if (value === savedNotes) return
        setSavingNotes(true)
        await updateAdminNotes(lead.id, value)
        setSavedNotes(value)
        setSavingNotes(false)
        setNotesSaved(true)
        setTimeout(() => setNotesSaved(false), 2000)
      }, 800)
    },
    [lead.id, savedNotes]
  )

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    const res = await updateLeadDetails(lead.id, profileForm)
    setProfileSaving(false)
    if (res.success) {
      setProfileSuccess(true)
      setIsEditingProfile(false)
      setTimeout(() => setProfileSuccess(false), 2500)
    } else {
      alert(res.error || 'Failed to update lead details')
    }
  }

  const cfg = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.HOLD
  const docCfg = DOC_STATUS_CONFIG[profileForm.documentsStatus] ?? DOC_STATUS_CONFIG.PENDING
  const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const locationSummary = [
    profileForm.city,
    profileForm.locality,
    profileForm.pincode ? `(${profileForm.pincode})` : null,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div
      className="rounded-xl border mb-3 overflow-hidden transition-all duration-200"
      style={{ borderColor: 'var(--color-border)', background: '#fff' }}
    >
      {/* Main row */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Name + role + location */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: lead.role === 'PARENT' ? '#eff6ff' : '#fdf4ff',
                color: lead.role === 'PARENT' ? '#1d4ed8' : '#7e22ce',
              }}
            >
              {lead.role === 'PARENT' ? '👨‍👩‍👧 Parent' : '👩‍🏫 Tutor'}
            </span>

            {/* Document badge for Tutors */}
            {lead.role === 'TUTOR' && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: docCfg.bg, color: docCfg.color }}
              >
                {docCfg.label}
              </span>
            )}

            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {formattedDate}
            </span>
          </div>

          <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
            {lead.name}
          </p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            📍 {locationSummary || lead.city}
          </p>

          {/* Quick Summary sub-text */}
          {lead.role === 'TUTOR' && (profileForm.qualification || profileForm.experience || profileForm.languages) && (
            <div className="mt-1 space-y-0.5">
              {(profileForm.qualification || profileForm.experience) && (
                <p className="text-xs font-medium" style={{ color: '#047857' }}>
                  🎓 {profileForm.qualification || 'N/A'} {profileForm.experience ? `• ${profileForm.experience}` : ''}
                </p>
              )}
              {profileForm.languages && (
                <p className="text-xs text-slate-500 font-medium">
                  🗣️ {profileForm.languages}
                </p>
              )}
            </div>
          )}
          {lead.role === 'PARENT' && (profileForm.studentGrade || profileForm.subjects || profileForm.languages) && (
            <div className="mt-1 space-y-0.5">
              {(profileForm.studentGrade || profileForm.subjects) && (
                <p className="text-xs font-medium" style={{ color: '#1d4ed8' }}>
                  🎒 {profileForm.studentGrade || 'Grade N/A'} {profileForm.subjects ? `• ${profileForm.subjects}` : ''}
                </p>
              )}
              {profileForm.languages && (
                <p className="text-xs text-slate-500 font-medium">
                  🗣️ {profileForm.languages}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Contact info */}
        <div className="lg:col-span-3">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-brand-green-dark)' }}
          >
            📱 {lead.phone}
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-1.5 text-xs mt-1 hover:underline truncate"
            style={{ color: 'var(--color-text-secondary)', maxWidth: '200px' }}
          >
            ✉️ {lead.email}
          </a>
        </div>

        {/* Status selector */}
        <div className="lg:col-span-3">
          <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            Status
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(STATUS_CONFIG).map(([key, c]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                disabled={statusPending}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-150"
                style={{
                  background: currentStatus === key ? c.bg : 'transparent',
                  color: currentStatus === key ? c.color : 'var(--color-text-muted)',
                  borderColor: currentStatus === key ? c.border : 'var(--color-border)',
                  opacity: statusPending ? 0.6 : 1,
                }}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Toggles */}
        <div className="lg:col-span-3 flex items-start justify-end gap-2 flex-wrap">
          {profileSuccess && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg font-medium">
              ✓ Saved!
            </span>
          )}
          <span
            className="px-2 py-1 rounded-lg text-xs font-semibold border"
            style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
          >
            {cfg.icon} {cfg.label}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 rounded-lg text-xs font-medium border transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
              background: expanded ? 'var(--color-bg-subtle)' : 'transparent',
            }}
          >
            {expanded ? '▲ Less' : '▼ Details & Location'}
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {expanded && (
        <div
          className="px-4 pb-4 animate-fade-in"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="pt-3 flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              📋 {lead.role === 'TUTOR' ? 'Tutor Qualification, Location & Verification' : 'Parent Location & Tuition Requirement'}
            </h4>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs font-semibold px-2.5 py-1 rounded-md border text-slate-700 hover:bg-slate-100"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {isEditingProfile ? 'Cancel Editing' : '✏️ Edit Profile'}
            </button>
          </div>

          {/* EDIT FORM MODE */}
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {/* Location & Languages Row with Language Dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-2.5 bg-white rounded-lg border border-slate-200">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Locality / Suburb</label>
                  <input
                    type="text"
                    value={profileForm.locality}
                    onChange={(e) => setProfileForm({ ...profileForm, locality: e.target.value })}
                    placeholder="e.g. Kothrud, Wakad"
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Pincode</label>
                  <input
                    type="text"
                    value={profileForm.pincode}
                    onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                    placeholder="e.g. 411038"
                    maxLength={6}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Languages (Dropdown)</label>
                  <select
                    value={profileForm.languages}
                    onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
                    className="form-input text-xs"
                  >
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <option key={lang} value={lang}>
                        🗣️ {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Class Range Checkboxes (1-5, 6-10, 11-12, NEET/JEE) */}
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  🎯 Class / Grade Level Checkboxes (1-5, 6-10, 11-12, NEET/JEE)
                </label>
                <div className="flex flex-wrap gap-3">
                  {CLASS_CATEGORIES.map((cat) => {
                    const isChecked = selectedClasses.includes(cat.id)
                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleClassToggle(cat.id)}
                          className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                        />
                        <span>Class {cat.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {lead.role === 'TUTOR' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-600">Qualification / Degree</label>
                      <input
                        type="text"
                        value={profileForm.qualification}
                        onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                        placeholder="e.g. M.Sc Math, B.Tech, PhD"
                        className="form-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-600">Experience</label>
                      <input
                        type="text"
                        value={profileForm.experience}
                        onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                        placeholder="e.g. 5+ Years, Ex-Allen"
                        className="form-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-600">Subjects / Courses</label>
                      <input
                        type="text"
                        value={profileForm.subjects}
                        onChange={(e) => setProfileForm({ ...profileForm, subjects: e.target.value })}
                        placeholder="e.g. Class 10-12 Math, Physics"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-600">Preferred Travel Locations</label>
                      <input
                        type="text"
                        value={profileForm.preferredLocations}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredLocations: e.target.value })}
                        placeholder="e.g. Kothrud, Deccan, Within 5km"
                        className="form-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-600">Teaching Mode</label>
                      <select
                        value={profileForm.teachingMode}
                        onChange={(e) => setProfileForm({ ...profileForm, teachingMode: e.target.value })}
                        className="form-input text-xs"
                      >
                        <option value="Home Tuition">🏡 Home Tuition</option>
                        <option value="Online">💻 Online</option>
                        <option value="Both">🔄 Home & Online Both</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-600">Verification Status</label>
                      <select
                        value={profileForm.documentsStatus}
                        onChange={(e) => setProfileForm({ ...profileForm, documentsStatus: e.target.value })}
                        className="form-input text-xs font-semibold"
                      >
                        <option value="PENDING">⏳ Pending Review</option>
                        <option value="VERIFIED">✅ Verified (ID & Degree)</option>
                        <option value="REJECTED">❌ Rejected</option>
                        <option value="NOT_REQUIRED">⚪ Not Required</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-600">Verification / Document Notes</label>
                    <input
                      type="text"
                      value={profileForm.documentsNotes}
                      onChange={(e) => setProfileForm({ ...profileForm, documentsNotes: e.target.value })}
                      placeholder="Aadhaar Verified, Degree checked"
                      className="form-input text-xs"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-600">Student Grade / Class Description</label>
                      <input
                        type="text"
                        value={profileForm.studentGrade}
                        onChange={(e) => setProfileForm({ ...profileForm, studentGrade: e.target.value })}
                        placeholder="e.g. Class 10 CBSE"
                        className="form-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-600">Budget Range</label>
                      <input
                        type="text"
                        value={profileForm.budget}
                        onChange={(e) => setProfileForm({ ...profileForm, budget: e.target.value })}
                        placeholder="e.g. ₹500/hr or ₹10,000/mo"
                        className="form-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-600">Subjects Needed</label>
                      <input
                        type="text"
                        value={profileForm.subjects}
                        onChange={(e) => setProfileForm({ ...profileForm, subjects: e.target.value })}
                        placeholder="e.g. Mathematics, Science"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-600">Detailed Address & Landmark</label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="Full home tuition address"
                      className="form-input text-xs"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="btn-primary text-xs px-4 py-1.5"
                >
                  {profileSaving ? 'Saving Profile…' : '💾 Save Profile'}
                </button>
              </div>
            </form>
          ) : (
            /* DISPLAY READ-ONLY PROFILE DISPLAY */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-400">Location & Area</p>
                <p className="text-xs font-medium text-slate-800">
                  {locationSummary || profileForm.city || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Languages Medium</p>
                <p className="text-xs font-medium text-slate-800">{profileForm.languages || 'Not specified'}</p>
              </div>

              {lead.role === 'TUTOR' ? (
                <>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Higher Education</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.qualification || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Experience</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.experience || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Subjects Taught</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.subjects || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Preferred Travel Locations</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.preferredLocations || 'All / Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Teaching Mode</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.teachingMode || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Verification Status</p>
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-bold mt-0.5"
                      style={{ background: docCfg.bg, color: docCfg.color }}
                    >
                      {docCfg.label}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-slate-400">Documents / Verification Notes</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.documentsNotes || 'None'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Student Grade / Class</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.studentGrade || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Budget</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.budget || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Subjects Needed</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.subjects || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-xs font-semibold text-slate-400">Detailed Address & Landmark</p>
                    <p className="text-xs font-medium text-slate-800">{profileForm.address || 'Not specified'}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* NOTES & ADMIN REMARKS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
            {/* User Original Notes */}
            <div>
              <p className="text-xs font-semibold mb-1.5 text-slate-500">
                📋 Form Inquiries / Special Remarks
              </p>
              <p
                className="text-xs p-2.5 rounded-lg"
                style={{
                  background: 'var(--color-bg-subtle)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {lead.notes || 'No special remarks provided upon form submission.'}
              </p>
            </div>

            {/* Admin Internal Call Notes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-slate-500">
                  🗒️ Admin Internal Onboarding Notes
                </p>
                {savingNotes && (
                  <span className="text-xs text-slate-400">Saving…</span>
                )}
                {notesSaved && (
                  <span className="text-xs font-semibold text-emerald-600">✓ Saved</span>
                )}
              </div>
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                rows={2}
                placeholder="e.g. Spoke on phone. Verified degree certificate. Scheduled interview demo for Monday."
                className="form-input"
                style={{ resize: 'vertical', minHeight: '64px', fontSize: '0.8125rem' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LeadTable({ leads }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div
        className="text-center py-16 rounded-2xl"
        style={{ background: '#fff', border: '1px dashed var(--color-border)' }}
      >
        <div className="text-5xl mb-3">📭</div>
        <p className="font-semibold text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          No leads found
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Try adjusting your search or filters
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs mb-3 font-medium" style={{ color: 'var(--color-text-muted)' }}>
        Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}
      </p>
      {leads.map((lead) => (
        <LeadRow key={lead.id} lead={lead} />
      ))}
    </div>
  )
}
