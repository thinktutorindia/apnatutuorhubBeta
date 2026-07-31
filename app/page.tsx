'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { submitLead, type ActionState } from '@/lib/actions'

const initialState: ActionState = { success: false }

const ROLES = [
  {
    id: 'PARENT',
    label: 'Parent / Student',
    icon: '👨‍👩‍👧',
    desc: 'Find qualified tutors for your child',
  },
  {
    id: 'TUTOR',
    label: 'Tutor / Instructor',
    icon: '👩‍🏫',
    desc: 'Grow your tutoring career',
  },
]

const FEATURES = [
  { icon: '🔍', title: 'Smart Matching', desc: 'AI-powered tutor-student matching by subject & budget' },
  { icon: '📅', title: 'Easy Scheduling', desc: 'Book sessions in seconds, manage your calendar effortlessly' },
  { icon: '✅', title: 'Verified Tutors', desc: 'Background-checked, qualified educators you can trust' },
  { icon: '💬', title: 'In-App Chat', desc: 'Communicate seamlessly between parents and tutors' },
]

const STATS = [
  { value: '500+', label: 'Tutors Registered' },
  { value: '1,200+', label: 'Parents Joined' },
  { value: '50+', label: 'Subjects Covered' },
  { value: '20+', label: 'Cities Onboarding' },
]

export default function LandingPage() {
  const [state, formAction, pending] = useActionState(submitLead, initialState)
  const [role, setRole] = useState<'PARENT' | 'TUTOR'>('PARENT')
  const formRef = useRef<HTMLFormElement>(null)

  // Scroll to form smoothly on success or duplicate
  const formSectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (state.success || state.duplicate || state.error) {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [state])

  const isDisabled = pending || state.success

  return (
    <main className="min-h-dvh" style={{ background: 'var(--color-bg-page)' }}>
      {/* ── Header ──────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(240, 253, 244, 0.85)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              A
            </div>
            <div>
              <span className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                ApnaTutorHub
              </span>
              <div
                className="text-xs font-medium hidden sm:block"
                style={{ color: 'var(--color-brand-green)' }}
              >
                Learn Anything, Anytime, Anywhere!
              </div>
            </div>
          </div>
          <a
            href="#early-access"
            className="btn-primary text-sm px-4 py-2"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            Join Waitlist
          </a>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24"
        style={{
          background:
            'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 40%, #bbf7d0 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #16a34a 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in-up">
            <span
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: 'var(--color-brand-green-muted)',
                color: 'var(--color-brand-green-dark)',
                border: '1px solid var(--color-brand-green-light)',
              }}
            >
              🎉 Early Access — Limited Spots Available
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.05s', color: 'var(--color-text-primary)' }}
          >
            India&apos;s Smartest{' '}
            <span className="text-gradient">Tutor Marketplace</span>
            {' '}is Almost Here
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up"
            style={{
              animationDelay: '0.1s',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.75',
            }}
          >
            Connect with verified tutors for home tuitions, online classes & more.
            Join the waitlist today — our team will personally onboard you when we launch.
          </p>

          {/* Stats strip */}
          <div
            className="inline-grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10 p-6 rounded-2xl animate-fade-in-up"
            style={{
              animationDelay: '0.15s',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.9)',
            }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-gradient">{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────── */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card p-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3
                className="font-semibold text-base mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Early Access Form ────────────────────── */}
      <section id="early-access" ref={formSectionRef} className="py-10 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-extrabold mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Grab Your{' '}
            <span className="text-gradient">Early Access Spot</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Be the first to know when we launch in your city. Zero spam, guaranteed.
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          {/* Success State */}
          {state.success ? (
            <div className="animate-fade-in-up text-center py-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
                style={{
                  background: 'var(--color-brand-green-muted)',
                  animation: 'pulse-green 2s infinite',
                }}
              >
                🎉
              </div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: 'var(--color-text-primary)' }}
              >
                You&apos;re on the List!
              </h3>
              <p
                className="text-base leading-relaxed max-w-md mx-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {state.message}
              </p>
              <div
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'var(--color-brand-green-muted)',
                  color: 'var(--color-brand-green-dark)',
                }}
              >
                📞 Expect a call within 24 hours
              </div>
            </div>
          ) : (
            <form ref={formRef} action={formAction} className="space-y-5">
              {/* Role Selector */}
              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  I am a… <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map((r) => (
                    <label
                      key={r.id}
                      htmlFor={`role-${r.id}`}
                      className="relative cursor-pointer"
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
                        className="p-4 rounded-xl border-2 transition-all duration-200 text-center"
                        style={{
                          borderColor: role === r.id ? 'var(--color-brand-green)' : 'var(--color-border)',
                          background: role === r.id ? 'var(--color-brand-green-muted)' : '#fff',
                          boxShadow: role === r.id ? '0 0 0 3px rgba(34,197,94,0.15)' : 'none',
                        }}
                      >
                        <div className="text-2xl mb-1">{r.icon}</div>
                        <div
                          className="font-semibold text-sm"
                          style={{
                            color:
                              role === r.id
                                ? 'var(--color-brand-green-dark)'
                                : 'var(--color-text-primary)',
                          }}
                        >
                          {r.label}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {r.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  required
                  disabled={isDisabled}
                  className="form-input"
                />
              </div>

              {/* Phone & Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="10-digit number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    disabled={isDisabled}
                    className="form-input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isDisabled}
                    className="form-input"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  City / Area <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="e.g. Pune, Baner"
                  required
                  disabled={isDisabled}
                  className="form-input"
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {role === 'PARENT'
                    ? 'Requirement / Subject Needed'
                    : 'Specialization / Subjects You Teach'}
                  <span className="ml-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder={
                    role === 'PARENT'
                      ? 'e.g. Class 10 Maths & Science, need home tutor'
                      : 'e.g. IIT-JEE Physics, CBSE Maths up to Class 12'
                  }
                  disabled={isDisabled}
                  className="form-input"
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>

              {/* Error / Duplicate Message */}
              {(state.error || state.duplicate) && (
                <div
                  className="rounded-xl p-4 flex items-start gap-3 animate-fade-in"
                  style={{
                    background: state.duplicate ? '#fef3c7' : '#fee2e2',
                    border: `1px solid ${state.duplicate ? '#fde68a' : '#fecaca'}`,
                  }}
                >
                  <span className="text-xl flex-shrink-0">{state.duplicate ? '⚠️' : '❌'}</span>
                  <p
                    className="text-sm font-medium"
                    style={{ color: state.duplicate ? '#92400e' : '#991b1b' }}
                  >
                    {state.error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isDisabled}
                className="btn-primary w-full text-base py-3"
                style={{ fontSize: '1rem', padding: '0.875rem 1.5rem' }}
              >
                {pending ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  '🚀 Join Early Access'
                )}
              </button>

              <p
                className="text-center text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                🔒 Your information is safe. We never share your data.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────── */}
      <footer
        className="border-t py-8 text-center"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} ApnaTutorHub. All rights reserved. &nbsp;·&nbsp;{' '}
          <span style={{ color: 'var(--color-brand-green)' }}>
            Learn Anything, Anytime, Anywhere!
          </span>
        </p>
      </footer>
    </main>
  )
}
