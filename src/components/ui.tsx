import type { ReactNode } from 'react'
import { Minus, Plus } from 'lucide-react'

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className={`block w-full rounded-3xl bg-card p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] ${onClick ? 'press' : ''} ${className}`}>
      {children}
    </Tag>
  )
}

export function ScreenHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-5 pt-safe pb-4">
      <div className="pt-4">
        {subtitle && <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">{subtitle}</p>}
        <h1 className="text-[34px] font-bold leading-tight tracking-tight">{title}</h1>
      </div>
      {right && <div className="pb-1.5">{right}</div>}
    </header>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2.5 mt-7 flex items-center justify-between px-1">
      <h2 className="text-[20px] font-bold tracking-tight">{children}</h2>
      {action}
    </div>
  )
}

type ButtonVariant = 'primary' | 'meal' | 'fit' | 'soft' | 'ghost' | 'danger'
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-bg',
  meal: 'bg-meal text-white shadow-lg shadow-meal/25',
  fit: 'bg-fit text-white shadow-lg shadow-fit/25',
  soft: 'bg-card2 text-ink',
  ghost: 'text-ink',
  danger: 'bg-red-500/10 text-red-500',
}

export function Button({
  children, onClick, variant = 'primary', className = '', disabled, type = 'button',
}: { children: ReactNode; onClick?: () => void; variant?: ButtonVariant; className?: string; disabled?: boolean; type?: 'button' | 'submit' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`press inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-[16px] font-semibold disabled:opacity-40 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function IconButton({ children, onClick, label, className = '' }: { children: ReactNode; onClick?: () => void; label: string; className?: string }) {
  return (
    <button aria-label={label} onClick={onClick} className={`press grid h-10 w-10 place-items-center rounded-full bg-card text-ink shadow-sm ${className}`}>
      {children}
    </button>
  )
}

export function Chip({ children, active, onClick, color = 'ink' }: { children: ReactNode; active?: boolean; onClick?: () => void; color?: 'ink' | 'meal' | 'fit' }) {
  const on = { ink: 'bg-ink text-bg', meal: 'bg-meal text-white', fit: 'bg-fit text-white' }[color]
  return (
    <button onClick={onClick} className={`press shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-semibold ${active ? on : 'bg-card text-ink'}`}>
      {children}
    </button>
  )
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-xl bg-card2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-[9px] py-2 text-[14px] font-semibold transition ${value === o.value ? 'bg-card text-ink shadow-sm' : 'text-muted'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Stepper({
  value, onChange, step = 1, min = 0, label, suffix,
}: { value: number; onChange: (v: number) => void; step?: number; min?: number; label?: string; suffix?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      {label && <span className="text-[16px] font-medium">{label}</span>}
      <div className="flex items-center gap-2">
        <button aria-label="Decrease" onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))} className="press grid h-10 w-10 place-items-center rounded-full bg-card2">
          <Minus size={18} />
        </button>
        <div className="flex min-w-16 items-baseline justify-center gap-1">
          <input
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
            className="w-14 bg-transparent text-center text-[20px] font-bold tabular-nums outline-none"
          />
          {suffix && <span className="text-[13px] text-muted">{suffix}</span>}
        </div>
        <button aria-label="Increase" onClick={() => onChange(+(value + step).toFixed(2))} className="press grid h-10 w-10 place-items-center rounded-full bg-card2">
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  )
}

export const inputClass = 'w-full rounded-2xl bg-card px-4 py-3.5 text-[16px] text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-meal/40'

export function EmptyState({ emoji, title, text, action }: { emoji: string; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-8 text-center">
      <div className="mb-3 text-5xl">{emoji}</div>
      <p className="text-[17px] font-semibold">{title}</p>
      <p className="mt-1 text-[15px] text-muted">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Stat({ value, label, unit }: { value: string | number; label: string; unit?: string }) {
  return (
    <div>
      <div className="text-[24px] font-bold tabular-nums tracking-tight">
        {value}
        {unit && <span className="ml-0.5 text-[14px] font-semibold text-muted">{unit}</span>}
      </div>
      <div className="text-[13px] text-muted">{label}</div>
    </div>
  )
}
