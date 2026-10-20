import { useMemo, useState } from 'react'
import { ChevronRight, Dumbbell, Flame, HeartPulse, RotateCcw } from 'lucide-react'
import Ring from '../components/Ring'
import { Card, EmptyState, ScreenHeader, SectionTitle } from '../components/ui'
import { CARDIO_TYPES } from '../data/exercises'
import { useAppState } from '../lib/store'
import { addDays, monthDay, startOfWeek, today } from '../lib/date'
import { cardioTotals, weekStreak, workoutVolume, workoutsInWeek } from '../lib/stats'
import { CardioSheet, StrengthSessionSheet, WorkoutDetailSheet } from './WorkoutSheets'
import type { StrengthExercise, Workout } from '../types'

export default function Workouts() {
  const { workouts, settings } = useAppState()
  const t = today()
  const [session, setSession] = useState<{ template: StrengthExercise[] | null } | null>(null)
  const [cardioOpen, setCardioOpen] = useState(false)
  const [detail, setDetail] = useState<Workout | null>(null)

  const thisWeek = workoutsInWeek(workouts, t)
  const activeDays = new Set(thisWeek.map((w) => w.date)).size
  const streak = weekStreak(workouts, settings.weeklyGoal, t)
  const minutes = thisWeek.reduce((m, w) => m + w.durationMin, 0)
  const lastStrength = [...workouts].filter((w) => w.kind === 'strength').sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)[0]

  const history = useMemo(() => {
    const groups = new Map<string, Workout[]>()
    ;[...workouts]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
      .forEach((w) => {
        const wk = startOfWeek(w.date)
        groups.set(wk, [...(groups.get(wk) ?? []), w])
      })
    return [...groups.entries()]
  }, [workouts])

  const weekLabel = (wk: string) => {
    if (wk === startOfWeek(t)) return 'This week'
    if (wk === addDays(startOfWeek(t), -7)) return 'Last week'
    return `${monthDay(wk)} – ${monthDay(addDays(wk, 6))}`
  }

  return (
    <div>
      <ScreenHeader title="Workouts" subtitle="Move a little every day" />

      <div className="px-5">
        <Card className="flex items-center gap-5">
          <Ring value={activeDays / settings.weeklyGoal} size={104} stroke={13}>
            <div>
              <div className="text-[26px] font-bold leading-none tabular-nums">{activeDays}</div>
              <div className="text-[12px] font-semibold text-muted">of {settings.weeklyGoal}</div>
            </div>
          </Ring>
          <div className="flex-1 space-y-2.5">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">This week</p>
              <p className="text-[17px] font-semibold">
                {activeDays >= settings.weeklyGoal ? 'Goal reached! 🎉' : `${settings.weeklyGoal - activeDays} more to hit your goal`}
              </p>
            </div>
            <div className="flex gap-4 text-[14px]">
              <span className="flex items-center gap-1 font-semibold"><Flame size={16} className="text-fit" />{streak} wk streak</span>
              <span className="text-muted">{minutes} min</span>
            </div>
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button onClick={() => setSession({ template: null })} className="press rounded-3xl bg-gradient-to-br from-fit to-amber-400 p-4 text-left text-white shadow-lg shadow-fit/25">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20"><Dumbbell size={24} /></span>
            <span className="mt-6 block text-[18px] font-bold">Strength</span>
            <span className="text-[14px] text-white/85">Sets, reps & weight</span>
          </button>
          <button onClick={() => setCardioOpen(true)} className="press rounded-3xl bg-gradient-to-br from-rose-500 to-pink-400 p-4 text-left text-white shadow-lg shadow-rose-500/25">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20"><HeartPulse size={24} /></span>
            <span className="mt-6 block text-[18px] font-bold">Cardio</span>
            <span className="text-[14px] text-white/85">Time & distance</span>
          </button>
        </div>

        {lastStrength?.exercises?.length ? (
          <Card onClick={() => setSession({ template: lastStrength.exercises! })} className="mt-3 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-fit-soft text-fit"><RotateCcw size={20} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-semibold">Repeat last workout</span>
              <span className="block truncate text-[14px] text-muted">{lastStrength.exercises.map((e) => e.name).join(' · ')}</span>
            </span>
            <ChevronRight size={18} className="text-muted" />
          </Card>
        ) : null}

        <SectionTitle>History</SectionTitle>
        {history.length === 0 ? (
          <Card><EmptyState emoji="🏁" title="No workouts yet" text="Start your first one above — every rep counts." /></Card>
        ) : (
          history.map(([wk, items]) => {
            const totals = cardioTotals(items)
            return (
              <div key={wk} className="mb-4">
                <div className="mb-1.5 flex justify-between px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">
                  <span>{weekLabel(wk)}</span>
                  <span>{items.length} workouts{totals.distance ? ` · ${totals.distance.toFixed(1)} ${settings.distanceUnit}` : ''}</span>
                </div>
                <Card className="divide-y divide-line !p-0">
                  {items.map((w) => {
                    const emoji = w.kind === 'cardio' ? CARDIO_TYPES.find((c) => c.id === w.cardio?.type)?.emoji ?? '❤️' : '🏋️'
                    return (
                      <button key={w.id} onClick={() => setDetail(w)} className="press flex w-full items-center gap-3 px-4 py-3 text-left">
                        <span className={`grid h-11 w-11 place-items-center rounded-2xl text-xl ${w.kind === 'cardio' ? 'bg-rose-500/10' : 'bg-fit-soft'}`}>{emoji}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[16px] font-semibold">
                            {w.kind === 'cardio' ? w.cardio?.type : w.exercises?.map((e) => e.name).join(', ') || 'Strength'}
                          </span>
                          <span className="text-[13px] text-muted">
                            {monthDay(w.date)} · {w.durationMin} min ·{' '}
                            {w.kind === 'cardio' ? `${w.cardio?.distance} ${settings.distanceUnit}` : `${workoutVolume(w).toLocaleString()} ${settings.weightUnit}`}
                          </span>
                        </span>
                        <ChevronRight size={18} className="text-muted" />
                      </button>
                    )
                  })}
                </Card>
              </div>
            )
          })
        )}
      </div>

      <StrengthSessionSheet open={!!session} template={session?.template ?? null} onClose={() => setSession(null)} />
      <CardioSheet open={cardioOpen} onClose={() => setCardioOpen(false)} />
      <WorkoutDetailSheet workout={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
