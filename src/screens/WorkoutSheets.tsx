import { useEffect, useMemo, useState } from 'react'
import { Check, Plus, Search, Timer, Trash2, Trophy } from 'lucide-react'
import Sheet from '../components/Sheet'
import { Button, Field, Stepper, inputClass } from '../components/ui'
import { toast } from '../components/Toast'
import { CARDIO_TYPES, EXERCISES } from '../data/exercises'
import { addWorkout, deleteWorkout, useAppState } from '../lib/store'
import { longDate, today } from '../lib/date'
import { bestE1rm, e1rm, lastSets, workoutVolume } from '../lib/stats'
import type { StrengthExercise, Workout } from '../types'

const REST_SECONDS = 90

function useTicker(active: boolean) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [active])
  return now
}

const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.max(0, sec % 60)).padStart(2, '0')}`

// ---------------- Strength session ----------------

export function StrengthSessionSheet({ open, template, onClose }: { open: boolean; template: StrengthExercise[] | null; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={() => confirm('Discard this workout?') && onClose()} tall title="🏋️ Strength">
      {open && <StrengthSession template={template} onDone={onClose} />}
    </Sheet>
  )
}

function StrengthSession({ template, onDone }: { template: StrengthExercise[] | null; onDone: () => void }) {
  const { workouts, settings } = useAppState()
  const [startedAt] = useState(Date.now())
  const [exercises, setExercises] = useState<StrengthExercise[]>(
    () => template?.map((e) => ({ name: e.name, sets: e.sets.map((s) => ({ ...s, done: false })) })) ?? [],
  )
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [restEndsAt, setRestEndsAt] = useState<number | null>(null)
  const now = useTicker(true)

  const bests = useMemo(() => new Map(exercises.map((e) => [e.name, bestE1rm(workouts, e.name)])), [exercises, workouts])
  const restLeft = restEndsAt ? Math.round((restEndsAt - now) / 1000) : 0
  useEffect(() => {
    if (restEndsAt && restLeft <= 0) {
      setRestEndsAt(null)
      navigator.vibrate?.(200)
    }
  }, [restLeft, restEndsAt])

  const doneSets = exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)

  const updateSet = (ei: number, si: number, patch: Partial<StrengthExercise['sets'][number]>) =>
    setExercises((prev) => prev.map((e, i) => (i !== ei ? e : { ...e, sets: e.sets.map((s, j) => (j === si ? { ...s, ...patch } : s)) })))

  const addExercise = (name: string) => {
    const prev = lastSets(workouts, name)
    const sets = prev.length ? prev.map((s) => ({ ...s, done: false })) : [0, 1, 2].map(() => ({ reps: 10, weight: 0, done: false }))
    setExercises((ex) => [...ex, { name, sets }])
    setLibraryOpen(false)
  }

  const finish = () => {
    const cleaned = exercises.map((e) => ({ ...e, sets: e.sets.filter((s) => s.done) })).filter((e) => e.sets.length)
    addWorkout({
      date: today(), kind: 'strength', createdAt: Date.now(),
      durationMin: Math.max(1, Math.round((Date.now() - startedAt) / 60000)), exercises: cleaned,
    })
    toast('Workout saved — nice work! 💪')
    onDone()
  }

  return (
    <div className="pb-4">
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-fit-soft px-4 py-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-fit">Elapsed</p>
          <p className="text-[24px] font-bold tabular-nums">{clock(Math.floor((now - startedAt) / 1000))}</p>
        </div>
        {restEndsAt ? (
          <button onClick={() => setRestEndsAt(null)} className="press flex items-center gap-2 rounded-full bg-fit px-4 py-2 font-semibold text-white">
            <Timer size={18} /> Rest {clock(restLeft)}
          </button>
        ) : (
          <p className="text-[14px] text-muted">{doneSets} sets done</p>
        )}
      </div>

      <div className="space-y-3">
        {exercises.map((ex, ei) => {
          const prev = lastSets(workouts, ex.name)
          return (
            <div key={ei} className="rounded-3xl bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-fit">{ex.name}</h3>
                <button aria-label="Remove exercise" onClick={() => setExercises((e) => e.filter((_, i) => i !== ei))} className="press p-1 text-muted">
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="grid grid-cols-[28px_1fr_64px_56px_40px] items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                <span>Set</span><span>Previous</span><span className="text-center">{settings.weightUnit}</span><span className="text-center">Reps</span><span />
              </div>
              {ex.sets.map((s, si) => {
                const isPR = s.done && s.weight > 0 && e1rm(s) > (bests.get(ex.name) ?? 0) && (bests.get(ex.name) ?? 0) > 0
                return (
                  <div key={si} className={`mt-1.5 grid grid-cols-[28px_1fr_64px_56px_40px] items-center gap-2 rounded-xl px-1 py-1 ${s.done ? 'bg-meal-soft' : ''}`}>
                    <span className="text-center text-[15px] font-bold">{si + 1}</span>
                    <span className="flex items-center gap-1 text-[13px] text-muted">
                      {prev[si] ? `${prev[si].weight} × ${prev[si].reps}` : '—'}
                      {isPR && <Trophy size={14} className="text-amber-500" />}
                    </span>
                    <input
                      inputMode="decimal"
                      value={s.weight || ''}
                      placeholder="0"
                      onChange={(e) => updateSet(ei, si, { weight: Number(e.target.value.replace(/[^0-9.]/g, '')) || 0 })}
                      className="h-10 rounded-xl bg-card2 text-center text-[16px] font-semibold tabular-nums outline-none"
                    />
                    <input
                      inputMode="numeric"
                      value={s.reps || ''}
                      placeholder="0"
                      onChange={(e) => updateSet(ei, si, { reps: Number(e.target.value.replace(/\D/g, '')) || 0 })}
                      className="h-10 rounded-xl bg-card2 text-center text-[16px] font-semibold tabular-nums outline-none"
                    />
                    <button
                      aria-label="Complete set"
                      onClick={() => {
                        updateSet(ei, si, { done: !s.done })
                        if (!s.done) setRestEndsAt(Date.now() + REST_SECONDS * 1000)
                      }}
                      className={`press grid h-10 w-10 place-items-center rounded-xl ${s.done ? 'bg-meal text-white' : 'bg-card2 text-muted'}`}
                    >
                      <Check size={18} strokeWidth={3} />
                    </button>
                  </div>
                )
              })}
              <button
                onClick={() =>
                  setExercises((prevEx) => prevEx.map((e, i) => (i === ei ? { ...e, sets: [...e.sets, { ...(e.sets.at(-1) ?? { reps: 10, weight: 0 }), done: false }] } : e)))
                }
                className="press mt-2 w-full rounded-xl bg-card2 py-2.5 text-[14px] font-semibold"
              >
                + Add set
              </button>
            </div>
          )
        })}
      </div>

      <Button variant="soft" className="mt-3 w-full text-fit" onClick={() => setLibraryOpen(true)}>
        <Plus size={18} /> Add exercise
      </Button>
      <Button variant="fit" className="mt-3 w-full" disabled={doneSets === 0} onClick={finish}>
        <Check size={18} /> Finish workout
      </Button>
      {doneSets === 0 && exercises.length > 0 && <p className="mt-2 text-center text-[13px] text-muted">Tick ✓ on a set when you complete it.</p>}

      <ExerciseLibrary open={libraryOpen} onClose={() => setLibraryOpen(false)} onPick={addExercise} />
    </div>
  )
}

function ExerciseLibrary({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (name: string) => void }) {
  const [q, setQ] = useState('')
  const groups = useMemo(() => {
    const query = q.trim().toLowerCase()
    const map = new Map<string, string[]>()
    EXERCISES.filter((e) => e.name.toLowerCase().includes(query)).forEach((e) => map.set(e.group, [...(map.get(e.group) ?? []), e.name]))
    return [...map.entries()]
  }, [q])
  const exact = EXERCISES.some((e) => e.name.toLowerCase() === q.trim().toLowerCase())

  return (
    <Sheet open={open} onClose={onClose} tall title="Add exercise">
      <div className="relative mb-3">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search or type a new exercise" className={`${inputClass} pl-11`} />
      </div>
      {q.trim() && !exact && (
        <button onClick={() => onPick(q.trim())} className="press mb-3 w-full rounded-2xl bg-fit-soft px-4 py-3 text-left font-semibold text-fit">
          + Add "{q.trim()}"
        </button>
      )}
      {groups.map(([group, names]) => (
        <div key={group} className="mb-4">
          <p className="mb-1.5 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">{group}</p>
          <div className="divide-y divide-line rounded-2xl bg-card">
            {names.map((n) => (
              <button key={n} onClick={() => onPick(n)} className="press flex w-full items-center justify-between px-4 py-3.5 text-left text-[16px]">
                {n}
                <Plus size={18} className="text-fit" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </Sheet>
  )
}

// ---------------- Cardio ----------------

export function CardioSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings } = useAppState()
  const [type, setType] = useState('Run')
  const [minutes, setMinutes] = useState(30)
  const [distance, setDistance] = useState(3)
  const [notes, setNotes] = useState('')

  const save = () => {
    addWorkout({ date: today(), kind: 'cardio', createdAt: Date.now(), durationMin: minutes, cardio: { type, minutes, distance }, notes: notes.trim() || undefined })
    toast(`${type} logged 🔥`)
    setNotes('')
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="❤️ Log cardio" footer={<Button variant="fit" className="w-full" disabled={minutes <= 0} onClick={save}><Check size={18} /> Save</Button>}>
      <div className="space-y-5 pt-1">
        <div className="grid grid-cols-3 gap-2">
          {CARDIO_TYPES.map((c) => (
            <button
              key={c.id}
              onClick={() => setType(c.id)}
              className={`press flex flex-col items-center gap-1 rounded-2xl py-3 ${type === c.id ? 'bg-fit text-white shadow-lg shadow-fit/25' : 'bg-card'}`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-[14px] font-semibold">{c.id}</span>
            </button>
          ))}
        </div>
        <div className="space-y-4 rounded-2xl bg-card p-4">
          <Stepper label="Duration" value={minutes} onChange={setMinutes} step={5} suffix="min" />
          <div className="h-px bg-line" />
          <Stepper label="Distance" value={distance} onChange={setDistance} step={0.5} suffix={settings.distanceUnit} />
        </div>
        <Field label="Notes (optional)">
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How did it feel?" className={inputClass} />
        </Field>
      </div>
    </Sheet>
  )
}

// ---------------- Detail ----------------

export function WorkoutDetailSheet({ workout, onClose }: { workout: Workout | null; onClose: () => void }) {
  const { settings } = useAppState()
  return (
    <Sheet
      open={!!workout}
      onClose={onClose}
      title={workout ? longDate(workout.date) : ''}
      footer={
        workout && (
          <Button
            variant="danger"
            className="w-full"
            onClick={() => {
              if (confirm('Delete this workout?')) {
                deleteWorkout(workout.id)
                onClose()
              }
            }}
          >
            <Trash2 size={18} /> Delete workout
          </Button>
        )
      }
    >
      {workout?.kind === 'strength' && (
        <div className="space-y-3">
          <p className="text-[15px] text-muted">
            {workout.durationMin} min · {workoutVolume(workout).toLocaleString()} {settings.weightUnit} total volume
          </p>
          {workout.exercises?.map((e, i) => (
            <div key={i} className="rounded-2xl bg-card p-4">
              <p className="mb-2 font-bold text-fit">{e.name}</p>
              {e.sets.map((s, j) => (
                <p key={j} className="flex justify-between py-0.5 text-[15px] tabular-nums">
                  <span className="text-muted">Set {j + 1}</span>
                  <span className="font-semibold">{s.weight} {settings.weightUnit} × {s.reps}</span>
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
      {workout?.kind === 'cardio' && workout.cardio && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4"><p className="text-[13px] text-muted">Type</p><p className="text-[20px] font-bold">{workout.cardio.type}</p></div>
          <div className="rounded-2xl bg-card p-4"><p className="text-[13px] text-muted">Duration</p><p className="text-[20px] font-bold">{workout.cardio.minutes} min</p></div>
          <div className="rounded-2xl bg-card p-4"><p className="text-[13px] text-muted">Distance</p><p className="text-[20px] font-bold">{workout.cardio.distance} {settings.distanceUnit}</p></div>
          <div className="rounded-2xl bg-card p-4">
            <p className="text-[13px] text-muted">Pace</p>
            <p className="text-[20px] font-bold">{workout.cardio.distance ? clock(Math.round((workout.cardio.minutes * 60) / workout.cardio.distance)) : '—'}<span className="text-[13px] text-muted">/{settings.distanceUnit}</span></p>
          </div>
          {workout.notes && <p className="col-span-2 rounded-2xl bg-card p-4 text-[15px]">{workout.notes}</p>}
        </div>
      )}
    </Sheet>
  )
}

