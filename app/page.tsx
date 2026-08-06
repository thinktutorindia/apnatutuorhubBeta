'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { submitLead, type ActionState } from '@/lib/actions'

const initialState: ActionState = { success: false }

const ROLES = [
  {
    id: 'PARENT',
    label: 'Parent / Student',
    icon: '👨‍👩‍👧',
    subtitle: 'Find verified tutors for home or online',
  },
  {
    id: 'TUTOR',
    label: 'Tutor / Instructor',
    icon: '👩‍🏫',
    subtitle: 'Get genuine student leads & grow earnings',
  },
]

const QUICK_SUBJECT_CHIPS = [
  '📐 Class 10 Maths & Science',
  '🧪 NEET / JEE Physics',
  '📚 CBSE Class 1 to 8',
  '💻 Coding & Computer',
  '🗣️ Spoken English',
  '📊 Commerce & Accounts',
]

const POPULAR_CITIES = ['Pune', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Jaipur', 'Ahmedabad']

const SUBJECT_CATEGORIES = [
  {
    id: 'k12',
    icon: '🎓',
    title: 'Class 1 to 10 (All Boards)',
    badge: 'Most Popular',
    desc: 'CBSE, ICSE, State Boards — Maths, Science, English, SST & Hindi.',
    prefill: 'Class 10 CBSE Maths and Science home tutor needed',
  },
  {
    id: 'jee-neet',
    icon: '⚡',
    title: 'JEE / NEET Competitive Exam',
    badge: 'Top Rated',
    desc: 'Expert Physics, Chemistry & Biology faculty with proven ranks.',
    prefill: 'NEET Physics and Chemistry home/online coaching',
  },
  {
    id: 'senior-sec',
    icon: '🔬',
    title: 'Class 11 & 12 (Science/Commerce)',
    badge: 'High Demand',
    desc: 'PCM, PCB, Accountancy, Economics & Computer Science specialization.',
    prefill: 'Class 12 Physics & Maths home tuition requirement',
  },
  {
    id: 'skills',
    icon: '💡',
    title: 'Spoken English & Coding',
    badge: 'New',
    desc: 'Python, Web Dev, Abacus, Vedic Maths & Communication skills.',
    prefill: 'Spoken English & Python coding classes online',
  },
]

const STATS = [
  { value: '5,000+', label: 'Verified Tutors', icon: '👩‍🏫' },
  { value: '12,500+', label: 'Parents Satisfied', icon: '⭐' },
  { value: '98%', label: 'Demo Satisfaction', icon: '🎯' },
  { value: '15 Mins', label: 'Avg Matching Time', icon: '⚡' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Submit Requirement',
    desc: 'Fill our 30-second form with your subject, class, and location.',
    icon: '📝',
  },
  {
    step: '02',
    title: 'Get 3 Matched Profiles',
    desc: 'Receive verified tutor profiles matched to your budget & area.',
    icon: '🎯',
  },
  {
    step: '03',
    title: 'Take Free 1-on-1 Demo',
    desc: 'Evaluate tutor in a free trial class before paying any fees.',
    icon: '🎉',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sangeeta Sharma',
    role: 'Parent of Class 10 Student',
    location: 'Kothrud, Pune',
    rating: 5,
    text: 'Found an excellent home tutor for Class 10 Maths within 2 hours! My daughter scored 94% in her board exams. Highly recommended service.',
    avatar: 'SS',
    bg: '#ecfdf5',
  },
  {
    name: 'Rajesh Malhotra',
    role: 'IIT-JEE Physics Tutor',
    location: 'Baner, Pune',
    rating: 5,
    text: 'ApnaTutorHub gave me direct parent leads without middleman cuts. I onboarded 4 new students in my first month itself.',
    avatar: 'RM',
    bg: '#fef3c7',
  },
  {
    name: 'Ananya Deshmukh',
    role: 'Parent of Class 6 Student',
    location: 'Wakad, Pune',
    rating: 5,
    text: 'The free demo class feature gave us total peace of mind. Tutor is polite, background verified and very punctual.',
    avatar: 'AD',
    bg: '#dbeafe',
  },
]

const FAQS = [
  {
    q: 'Is the 1-on-1 Demo Class really 100% free?',
    a: 'Yes, absolutely! The first trial demo session is completely free. You only proceed with regular classes if you are 100% satisfied with the tutor’s teaching style.',
  },
  {
    q: 'How are tutors verified on ApnaTutorHub?',
    a: 'Every tutor undergoes strict identity document checks (Aadhaar/PAN), degree qualification verification, and background checks before being matched with parents.',
  },
  {
    q: 'Are tutors available for Home Tuitions and Online Classes?',
    a: 'Yes! We support both offline in-person home tuitions (tutor visits your home) and interactive 1-on-1 online classes based on your preference.',
  },
  {
    q: 'How quickly will I get tutor profiles after submitting the form?',
    a: 'Our academic manager calls you within 15 to 30 minutes to understand your timing and budget, and sends you 3 matched profiles on WhatsApp immediately.',
  },
]

export default function LandingPage() {
  const [state, formAction, pending] = useActionState(submitLead, initialState)
  const [role, setRole] = useState<'PARENT' | 'TUTOR'>('PARENT')
  const [phoneInput, setPhoneInput] = useState('')
  const [cityInput, setCityInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const formRef = useRef<HTMLFormElement>(null)
  const formSectionRef = useRef<HTMLDivElement>(null)

  // Auto scroll to form when user clicks subject chips or on form submit state change
  useEffect(() => {
    if (state.success || state.duplicate || state.error) {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [state])

  const scrollToFormWithNotes = (notesText: string) => {
    setNotesInput(notesText)
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isPhoneValid = /^\d{10}$/.test(phoneInput)
  const isDisabled = pending || state.success

  return (
    <main className="min-h-dvh flex flex-col" style={{ background: 'var(--color-bg-page)' }}>
      {/* ── Top Announcement Ticker Bar ── */}
      <div className="bg-emerald-950 text-emerald-300 text-[11px] sm:text-xs py-2 px-3 text-center font-medium border-b border-emerald-800/50 flex items-center justify-center gap-2 overflow-hidden">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
        <span className="truncate">
          ⚡ <strong>Limited Time Offer:</strong> Instant Tutor Match + 100% Free 1-on-1 Demo Class
        </span>
        <span className="hidden md:inline text-emerald-400 font-semibold">• 📞 Call Support: +91 62307 89155</span>
      </div>

      {/* ── Header Navbar ───────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-base sm:text-xl shadow-md shrink-0"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
            >
              A
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 truncate">
                  ApnaTutor<span className="text-emerald-600">Hub</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ⭐ 4.9/5 Rating
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 hidden sm:block truncate">
                India&apos;s Most Trusted Home & Online Tutor Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a
              href="https://wa.me/916230789155?text=Hi%20ApnaTutorHub,%20I%20need%20a%20tutor"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-all whitespace-nowrap"
            >
              <span>💬 WhatsApp</span>
            </a>

            <button
              onClick={() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-xs font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-md whitespace-nowrap shrink-0"
            >
              ⚡ Free Demo
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────── */}
      <section className="relative pt-4 sm:pt-8 pb-10 lg:py-16 overflow-hidden">
        {/* Background Mesh Gradient Blobs */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-25 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -left-24 w-80 h-80 rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* Headline Section */}
            <div className="lg:col-span-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-3 animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>🔥 1,200+ Verified Tutors Active in Your City</span>
              </div>

              <h1
                className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.18] mb-3 tracking-tight animate-fade-in-up"
                style={{ animationDelay: '0.05s' }}
              >
                Find Top Verified Tutors For{' '}
                <span className="text-gradient">Home & Online Tuitions</span> in 60 Seconds
              </h1>

              <p
                className="text-xs sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                Get 3 hand-picked, background-verified tutor profiles matching your class, subject & budget. Zero upfront charges — take a <strong>Free 1-on-1 Trial Class</strong> today!
              </p>

              {/* Trust Checkmarks - Hidden on mobile hero to keep mobile view clean */}
              <div
                className="hidden lg:block space-y-3 mb-6 animate-fade-in-up"
                style={{ animationDelay: '0.15s' }}
              >
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span>100% Background & Qualification Verified Tutors</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span>Free 1-on-1 Trial Demo Class Before Paying Any Fee</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span>Flexible Monthly Billing & Dedicated Academic Manager</span>
                </div>
              </div>

              {/* Live Ticker Box - Hidden on mobile hero for zero clutter */}
              <div
                className="hidden lg:flex p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm backdrop-blur-sm items-center gap-3.5 animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                    SS
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    RM
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                    AD
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>14 Parents matched in Pune & Mumbai in last 2 hours</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Class 10 CBSE, NEET Physics & Spoken English inquiries active
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Form Card */}
            <div
              id="lead-form"
              ref={formSectionRef}
              className="lg:col-span-6 w-full animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="card-glass p-4 sm:p-7 relative border border-slate-200/90 shadow-2xl">
                {/* Form Header */}
                <div className="flex items-center justify-between mb-3.5">
                  <div>
                    <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>Book Free Trial Class</span>
                      <span className="text-lg sm:text-xl">🎓</span>
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      Get 3 matched tutor profiles on WhatsApp in 15 mins
                    </p>
                  </div>
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                    ⚡ 100% Free
                  </span>
                </div>

                {/* Success State */}
                {state.success ? (
                  <div className="animate-fade-in text-center py-6">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-3 bg-emerald-100 text-emerald-600 animate-pulse-glow"
                    >
                      🎉
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1.5">
                      Request Submitted!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mb-5 leading-relaxed">
                      {state.message}
                    </p>
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold inline-flex items-center gap-2">
                      <span>📞 Academic Coordinator will call you within 15 minutes.</span>
                    </div>
                  </div>
                ) : (
                  <form ref={formRef} action={formAction} className="space-y-3">
                    {/* Role Tabs */}
                    <div>
                      <label className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                        Select Role <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {ROLES.map((r) => (
                          <label
                            key={r.id}
                            htmlFor={`role-${r.id}`}
                            className="cursor-pointer select-none"
                          >
                            <input
                              type="radio"
                              id={`role-${r.id}`}
                              name="role"
                              value={r.id}
                              checked={role === r.id}
                              onChange={() => setRole(r.id as 'PARENT' | 'TUTOR')}
                              disabled={isDisabled}
                              className="sr-only"
                              required
                            />
                            <div
                              className="p-2 sm:p-3 rounded-xl border-2 transition-all text-left flex items-center gap-2"
                              style={{
                                borderColor: role === r.id ? 'var(--color-emerald-500)' : '#cbd5e1',
                                background: role === r.id ? '#ecfdf5' : '#ffffff',
                                boxShadow: role === r.id ? '0 0 0 3px rgba(16, 185, 129, 0.18)' : 'none',
                              }}
                            >
                              <span className="text-lg sm:text-2xl">{r.icon}</span>
                              <div className="min-w-0 flex-1">
                                <div className="font-extrabold text-xs text-slate-900 truncate">{r.label}</div>
                                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium truncate">
                                  {r.subtitle}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Quick Subject Chips */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-600">
                          1-Tap Subject Select
                        </label>
                        <span className="text-[10px] text-emerald-700 font-bold">Tap to pre-fill</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_SUBJECT_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => setNotesInput(chip.replace(/^[^\s]+\s/, ''))}
                            className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all active:scale-95"
                            style={{
                              background: notesInput.includes(chip.replace(/^[^\s]+\s/, ''))
                                ? '#d1fae5'
                                : '#ffffff',
                              color: notesInput.includes(chip.replace(/^[^\s]+\s/, ''))
                                ? '#047857'
                                : '#334155',
                              borderColor: notesInput.includes(chip.replace(/^[^\s]+\s/, ''))
                                ? '#10b981'
                                : '#cbd5e1',
                            }}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-bold text-slate-800 mb-1"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={role === 'PARENT' ? 'e.g. Radhika Sharma' : 'e.g. Prof. Alok Verma'}
                        required
                        disabled={isDisabled}
                        className="form-input text-sm py-2 px-3"
                      />
                    </div>

                    {/* Phone & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label
                            htmlFor="phone"
                            className="block text-xs font-bold text-slate-800"
                          >
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          {isPhoneValid && (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                              ✓ 10 Digits
                            </span>
                          )}
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="10-digit mobile number"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          required
                          disabled={isDisabled}
                          className="form-input text-sm py-2 px-3 font-medium"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-bold text-slate-800 mb-1"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          disabled={isDisabled}
                          className="form-input text-sm py-2 px-3"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-xs font-bold text-slate-800 mb-1"
                      >
                        City / Area <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        placeholder="e.g. Pune, Baner / Kothrud"
                        required
                        disabled={isDisabled}
                        className="form-input text-sm py-2 px-3"
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        <span className="text-[10px] text-slate-400 self-center font-medium">Quick:</span>
                        {POPULAR_CITIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCityInput(c)}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Requirement / Notes */}
                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-xs font-bold text-slate-800 mb-1"
                      >
                        {role === 'PARENT'
                          ? 'Subject / Class Requirement'
                          : 'Specialization & Teaching Subjects'}
                        <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={2}
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder={
                          role === 'PARENT'
                            ? 'e.g. Class 10 Maths & Science home tutor needed'
                            : 'e.g. IIT-JEE Physics faculty with 5 yrs experience'
                        }
                        disabled={isDisabled}
                        className="form-input text-sm py-1.5 px-3"
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    {/* Error / Duplicate Notification */}
                    {(state.error || state.duplicate) && (
                      <div
                        className="rounded-xl p-3 flex items-start gap-2 text-xs font-medium animate-fade-in"
                        style={{
                          background: state.duplicate ? '#fffbebe6' : '#fef2f2',
                          border: `1px solid ${state.duplicate ? '#fde68a' : '#fecaca'}`,
                          color: state.duplicate ? '#b45309' : '#991b1b',
                        }}
                      >
                        <span className="text-base leading-none">{state.duplicate ? '⚠️' : '❌'}</span>
                        <div>{state.error}</div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isDisabled}
                      className="btn-primary btn-amber w-full py-3 text-sm sm:text-base font-extrabold rounded-xl shadow-amber mt-1"
                    >
                      {pending ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Submitting Request…</span>
                        </div>
                      ) : (
                        <span>🚀 Get Free Tutor Demo Now</span>
                      )}
                    </button>

                    <p className="text-center text-[10px] text-slate-500 font-medium pt-0.5">
                      🔒 100% Free Demo Session • No Upfront Fees
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ─────────────────────────────── */}
      <section className="py-6 sm:py-8 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-lg sm:text-2xl mb-1">{s.icon}</div>
                <div className="text-lg sm:text-3xl font-black text-amber-400 tracking-tight">
                  {s.value}
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subject & Grade Quick Selector ───────────── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            Browse By Category
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2.5">
            Top Subjects & Board Programs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Click any category to auto-fill your requirement into the lead form.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUBJECT_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => scrollToFormWithNotes(cat.prefill)}
              className="card p-5 cursor-pointer hover:border-emerald-400 hover:shadow-xl group transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2 rounded-xl bg-emerald-50 border border-emerald-100 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {cat.badge}
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-1.5 group-hover:text-emerald-600 transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{cat.desc}</p>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Select & Book Demo</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3-Step How It Works Section ──────────────── */}
      <section className="py-12 sm:py-16 bg-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2.5">
              How You Get Matched With Tutors
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1.5">
              Fast, transparent, and completely free until your demo class.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {HOW_IT_WORKS.map((hw) => (
              <div
                key={hw.step}
                className="p-6 sm:p-8 rounded-2xl bg-emerald-900/40 border border-emerald-800/80 backdrop-blur-sm relative group hover:border-emerald-500 transition-all"
              >
                <div className="text-3xl sm:text-4xl font-black text-emerald-800/60 absolute top-4 right-6 group-hover:text-emerald-500/40 transition-colors">
                  {hw.step}
                </div>
                <div className="text-3xl sm:text-4xl mb-3">{hw.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{hw.title}</h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">{hw.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ────────────────────── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            Real Reviews
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2.5">
            Trusted By 12,000+ Parents & Tutors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-2.5 text-xs sm:text-sm">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3.5 border-t border-slate-100">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-slate-800 text-xs shrink-0"
                  style={{ background: t.bg }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{t.name}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                    {t.role} • {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Accordion Section ───────────────────── */}
      <section className="py-12 sm:py-16 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, index) => (
              <div
                key={faq.q}
                className="card overflow-hidden transition-all"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <button
                  type="button"
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-3"
                >
                  <span>{faq.q}</span>
                  <span className="text-emerald-600 text-base sm:text-lg shrink-0">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-2 text-white font-extrabold text-lg">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm">
              A
            </div>
            <span>ApnaTutorHub</span>
          </div>
          <p className="mb-3 text-slate-400 max-w-md mx-auto text-xs">
            Connecting students with qualified home & online tutors across India.
          </p>
          <p className="text-[11px] text-slate-500">© {new Date().getFullYear()} ApnaTutorHub. All rights reserved. • Built for high performance & trust.</p>
        </div>
      </footer>

      {/* ── Sleek Mobile Floating Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 py-2 px-4 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl z-40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
          <div className="min-w-0">
            <div className="text-xs font-extrabold text-slate-900 leading-tight truncate">Need a Tutor?</div>
            <div className="text-[10px] text-emerald-600 font-semibold truncate">100% Free Trial Class</div>
          </div>
        </div>
        <button
          onClick={() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-primary btn-amber text-xs py-2 px-3.5 rounded-lg font-bold shadow-md whitespace-nowrap shrink-0"
        >
          🚀 Book Demo
        </button>
      </div>
    </main>
  )
}
