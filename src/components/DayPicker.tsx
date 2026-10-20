import { dayNum, dayShort, today } from '../lib/date'

/** Horizontal row of days (e.g. this week) — tap one to select it. */
export default function DayPicker({ days, value, onChange }: { days: string[]; value: string; onChange: (d: string) => void }) {
  const t = today()
  return (
    <div className="flex gap-1.5">
      {days.map((d) => {
        const active = d === value
        const past = d < t
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`press flex flex-1 flex-col items-center rounded-2xl py-2 ${active ? 'bg-meal text-white' : 'bg-card'} ${past && !active ? 'opacity-50' : ''}`}
          >
            <span className={`text-[11px] font-semibold uppercase ${active ? 'text-white/85' : 'text-muted'}`}>{dayShort(d)}</span>
            <span className="text-[17px] font-bold tabular-nums">{dayNum(d)}</span>
            {d === t && <span className={`mt-0.5 h-1 w-1 rounded-full ${active ? 'bg-white' : 'bg-meal'}`} />}
          </button>
        )
      })}
    </div>
  )
}
