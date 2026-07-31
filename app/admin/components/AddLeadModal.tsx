'use client'

import { useActionState, useEffect, useState } from 'react'
import { addLeadManually, type ActionState } from '@/lib/actions'

const initialState: ActionState = { success: false }

interface AddLeadModalProps {
  onClose: () => void
}

const CLASS_CATEGORIES = [
  { id: '1-5', label: 'Class 1 - 5 (Primary)' },
  { id: '6-10', label: 'Class 6 - 10 (Secondary)' },
  { id: '11-12', label: 'Class 11 - 12 (Higher Sec)' },
  { id: 'NEET/JEE', label: 'NEET / JEE / Entrance' },
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
  'Other / Multiple',
]

export default function AddLeadModal({ onClose }: AddLeadModalProps) {
  const [state, formAction, pending] = useActionState(addLeadManually, initialState)
  const [selectedRole, setSelectedRole] = useState<'PARENT' | 'TUTOR'>('PARENT')

  // Checkbox state for 1-5, 6-10, 11-12, NEET/JEE
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [customGrade, setCustomGrade] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('English & Hindi (Hinglish)')
  const [customLanguage, setCustomLanguage] = useState('')

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => onClose(), 1500)
      return () => clearTimeout(timer)
    }
  }, [state.success, onClose])

  const handleClassToggle = (id: string) => {
    setSelectedClasses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Combine selected checkboxes + custom grade input
  const combinedStudentGrade = [
    selectedClasses.length > 0 ? `[Classes: ${selectedClasses.join(', ')}]` : '',
    customGrade,
  ]
    .filter(Boolean)
    .join(' ')

  // Combine language dropdown + custom language
  const finalLanguage =
    selectedLanguage === 'Other / Multiple' && customLanguage
      ? customLanguage
      : selectedLanguage

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden animate-fade-in-up"
        style={{ background: '#fff', boxShadow: 'var(--shadow-lg)', maxHeight: '90dvh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              ➕ Add Lead & Profile Details
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Log inquiry, class level (1-5, 6-10, 11-12), languages & onboarding info
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {state.success ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                Lead & Profile Saved!
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Closing…
              </p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Role <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'PARENT', label: '👨‍👩‍👧 Parent / Student' },
                    { id: 'TUTOR', label: '👩‍🏫 Tutor / Instructor' },
                  ].map((r) => (
                    <label key={r.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={r.id}
                        checked={selectedRole === r.id}
                        onChange={() => setSelectedRole(r.id as 'PARENT' | 'TUTOR')}
                        required
                        className="sr-only peer"
                      />
                      <div
                        className="p-3 rounded-lg border-2 text-center text-sm font-medium transition-all cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                      >
                        {r.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input name="name" type="text" placeholder="Full Name" required className="form-input" />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Phone <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="10-digit number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input name="email" type="email" placeholder="email@example.com" required className="form-input" />
                </div>
              </div>

              {/* City, Locality & Pincode */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    City <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input name="city" type="text" placeholder="e.g. Pune" required className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Locality / Area
                  </label>
                  <input name="locality" type="text" placeholder="e.g. Kothrud" className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Pincode
                  </label>
                  <input name="pincode" type="text" placeholder="e.g. 411038" pattern="[0-9]{6}" maxLength={6} className="form-input" />
                </div>
              </div>

              {/* Status & Language Dropdown */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Initial Status
                  </label>
                  <select name="status" className="form-input" defaultValue="HOLD">
                    <option value="HOLD">⏳ Hold</option>
                    <option value="CONTACTED">📞 Contacted</option>
                    <option value="ACTIVE">✅ Active</option>
                    <option value="BLOCKED">🚫 Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Language / Medium Dropdown
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="form-input"
                  >
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <option key={lang} value={lang}>
                        🗣️ {lang}
                      </option>
                    ))}
                  </select>

                  {selectedLanguage === 'Other / Multiple' && (
                    <input
                      type="text"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="Specify custom language(s)"
                      className="form-input text-xs mt-1.5"
                    />
                  )}

                  {/* Hidden field for form submit */}
                  <input type="hidden" name="languages" value={finalLanguage} />
                </div>
              </div>

              {/* Class / Grade Range Checkboxes (1-5, 6-10, 11-12, NEET/JEE) */}
              <div
                className="p-3.5 rounded-xl space-y-2 border"
                style={{ background: '#f8fafc', borderColor: 'var(--color-border)' }}
              >
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  🎯 Class / Grade Level Checkboxes (Tick applicable classes)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CLASS_CATEGORIES.map((cat) => {
                    const isChecked = selectedClasses.includes(cat.id)
                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleClassToggle(cat.id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                        />
                        <span>{cat.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Role-Specific Profile Section */}
              <div
                className="p-4 rounded-xl space-y-3"
                style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{selectedRole === 'TUTOR' ? '🎓' : '🎒'}</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedRole === 'TUTOR' ? 'Tutor Qualification & Preferences' : 'Student & Tuition Requirement'}
                  </h3>
                </div>

                {selectedRole === 'TUTOR' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Higher Qualification / Degree
                        </label>
                        <input
                          name="qualification"
                          type="text"
                          placeholder="e.g. M.Sc Math / B.Tech / B.Ed"
                          className="form-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Experience
                        </label>
                        <input
                          name="experience"
                          type="text"
                          placeholder="e.g. 5+ Years, Ex-Allen Faculty"
                          className="form-input text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Subjects & Courses Taught
                        </label>
                        <input
                          name="subjects"
                          type="text"
                          placeholder="e.g. Class 9-12 Math, Physics, NEET"
                          className="form-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Preferred Travel Locations / Radius
                        </label>
                        <input
                          name="preferredLocations"
                          type="text"
                          placeholder="e.g. Kothrud, Deccan, Within 5km"
                          className="form-input text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Teaching Mode
                        </label>
                        <select name="teachingMode" className="form-input text-xs" defaultValue="Both">
                          <option value="Home Tuition">🏡 Home Tuition</option>
                          <option value="Online">💻 Online</option>
                          <option value="Both">🔄 Home & Online Both</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Documents Verification
                        </label>
                        <select name="documentsStatus" className="form-input text-xs" defaultValue="PENDING">
                          <option value="PENDING">⏳ Pending Review</option>
                          <option value="VERIFIED">✅ Verified (ID & Degree)</option>
                          <option value="REJECTED">❌ Rejected</option>
                          <option value="NOT_REQUIRED">⚪ Not Required</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                        Document Proof Links / Notes
                      </label>
                      <input
                        name="documentsNotes"
                        type="text"
                        placeholder="e.g. Aadhaar Verified, Degree PDF in Drive"
                        className="form-input text-xs"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Specific Student Grade / Board
                        </label>
                        <input
                          type="text"
                          value={customGrade}
                          onChange={(e) => setCustomGrade(e.target.value)}
                          placeholder="e.g. Class 10th CBSE / Grade 8 IB"
                          className="form-input text-xs"
                        />
                        {/* Combined hidden input for form submit */}
                        <input type="hidden" name="studentGrade" value={combinedStudentGrade} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Budget / Fee Range
                        </label>
                        <input
                          name="budget"
                          type="text"
                          placeholder="e.g. ₹500/hr or ₹8,000/mo"
                          className="form-input text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Subjects Needed
                        </label>
                        <input
                          name="subjects"
                          type="text"
                          placeholder="e.g. Math, Science, English"
                          className="form-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Detailed Address & Landmark
                        </label>
                        <input
                          name="address"
                          type="text"
                          placeholder="e.g. Flat 402, Kothrud, near Karve Statue"
                          className="form-input text-xs"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* General Notes */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Call Notes / Inquiries
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="e.g. Spoke on phone, wants demo class on Saturday"
                  className="form-input"
                  style={{ resize: 'vertical', minHeight: '56px' }}
                />
              </div>

              {/* Error */}
              {state.error && (
                <div
                  className="rounded-xl p-3 flex items-center gap-2"
                  style={{ background: '#fee2e2', border: '1px solid #fecaca' }}
                >
                  <span>⚠️</span>
                  <p className="text-sm font-medium" style={{ color: '#991b1b' }}>
                    {state.error}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={pending} className="btn-primary flex-1">
                  {pending ? 'Saving…' : '💾 Save Lead'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
