import { useMemo, useState, type ReactNode } from 'react'
import { Area, AreaChart, Bar, BarChart, Cell, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChevronRight, Dumbbell, Flame, Plus, Moon, Settings as Gear, Sun, TrendingDown, TrendingUp, UtensilsCrossed } from 'lucide-react'
import Ring from '../components/Ring'
import Sheet from '../components/Sheet'
import { Button, Card, Chip, EmptyState, IconButton, SectionTitle, Stat, Stepper } from '../components/ui'
import { toast } from '../components/Toast'
import type { Tab } from '../components/TabBar'
import { logWeight, updateSettings, useAppState, useRecipes } from '../lib/store'
import { isDark } from '../lib/theme'
import { addDays, dayShort, greeting, longDate, monthDay, today, weekDates } from '../lib/date'
import { cardioTotals, dayNutrition, loggedExercises, strengthHistory, weekStreak, workoutsInWeek } from '../lib/stats'
import SettingsSheet from './Settings'

const C = { meal: '#4f8f4b', fit: '#e8743b', sky: '#4a7fb5', grape: '#9b5f8e', muted: '#8f8272' }
const axis = { tick: { fill: C.muted, fontSize: 11 }, axisLine: false, tickLine: false } as const

function ChartTip({ active, payload, label, unit, fmt }: { active?: boolean; payload?: { value: number }[]; label?: string; unit: string; fmt?: (l: string) => string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-ink px-3 py-2 text-[13px] text-bg shadow-lg">
      <div className="opacity-70">{fmt && label ? fmt(label) : label}</div>
      <div className="font-bold tabular-nums">{payload[0].value.toLocaleString()} {unit}</div>
    </div>
  )
}

export default function Dashboard({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { workouts, weights, plan, settings } = useAppState()
  const recipes = useRecipes()
  const byId = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes])
  const t = today()
  const week = weekDates(t)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [weightOpen, setWeightOpen] = useState(false)
  const lastWeight = weights.at(-1)?.value ?? (settings.weightUnit === 'lb' ? 170 : 77)
  const [weightDraft, setWeightDraft] = useState(lastWeight)

  // Activity
  const thisWeek = workoutsInWeek(workouts, t)
  const activeDays = new Set(thisWeek.map((w) => w.date))
  const streak = weekStreak(workouts, settings.weeklyGoal, t)
  const workedOutToday = activeDays.has(t)
  const cardio = cardioTotals(thisWeek)

  // Nutrition
  const todayNut = dayNutrition(plan, byId, t)
  const todayMeals = plan.filter((p) => p.date === t)
  const weekNut = week.map((d) => ({ date: d, label: dayShort(d).slice(0, 1), calories: dayNutrition(plan, byId, d).calories }))

  // Weight (last 60 days)
  const weightData = weights.filter((w) => w.date >= addDays(t, -60)).map((w) => ({ date: w.date, value: w.value }))
  const weightChange = weightData.length > 1 ? +(weightData.at(-1)!.value - weightData[0].value).toFixed(1) : 0

  // Strength
  const exercises = loggedExercises(workouts)
  const [lift, setLift] = useState<string | null>(null)
  const activeLift = lift && exercises.includes(lift) ? lift : exercises[0]
  const liftData = activeLift ? strengthHistory(workouts, activeLift) : []
  const liftGain = liftData.length > 1 ? liftData.at(-1)!.e1rm - liftData[0].e1rm : 0

  const name = settings.name.trim()

  return (
    <div>
      <header className="flex items-end justify-between px-5 pt-safe pb-4">
        <div className="pt-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">{longDate(t)}</p>
          <h1 className="text-[34px] font-bold leading-tight tracking-tight">{greeting()}{name ? `, ${name}` : ''}</h1>
        </div>
        <div className="flex gap-2 pb-1.5">
          <IconButton label={isDark(settings.theme) ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => updateSettings({ theme: isDark(settings.theme) ? 'light' : 'dark' })}>
            {isDark(settings.theme) ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
          <IconButton label="Settings" onClick={() => setSettingsOpen(true)}><Gear size={20} /></IconButton>
        </div>
      </header>

      <div className="px-5">
        {/* Weekly activity */}
        <Card className="flex items-center gap-5">
          <Ring value={activeDays.size / settings.weeklyGoal} size={112} stroke={14}>
            <div>
              <div className="text-[28px] font-bold leading-none tabular-nums">{activeDays.size}/{settings.weeklyGoal}</div>
              <div className="mt-0.5 text-[11px] font-semibold uppercase text-muted">workouts</div>
            </div>
          </Ring>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[17px] font-bold">
              <Flame size={18} className="text-fit" /> {streak} week streak
            </p>
            <p className="mt-0.5 text-[14px] text-muted">
              {activeDays.size >= settings.weeklyGoal ? 'Weekly goal smashed 🎉' : `${settings.weeklyGoal - activeDays.size} to go this week`}
            </p>
            <div className="mt-3 flex justify-between">
              {week.map((d) => (
                <div key={d} className="flex flex-col items-center gap-1">
                  <span className={`h-6 w-6 rounded-full ${activeDays.has(d) ? 'bg-fit' : d === t ? 'border-2 border-fit/40' : 'bg-card2'}`} />
                  <span className={`text-[10px] font-semibold ${d === t ? 'text-ink' : 'text-muted'}`}>{dayShort(d).slice(0, 1)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Today at a glance */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <QuickCard
            onClick={() => onNavigate('meals')}
            icon={<UtensilsCrossed size={20} />}
            tone="meal"
            title={todayMeals.length ? `${todayMeals.length} meal${todayMeals.length > 1 ? 's' : ''} planned` : 'Plan a meal'}
            text={todayMeals.length ? todayMeals.map((p) => byId.get(p.recipeId)?.emoji).join(' ') : 'Pick a cuisine →'}
          />
          <QuickCard
            onClick={() => onNavigate('workouts')}
            icon={<Dumbbell size={20} />}
            tone="fit"
            title={workedOutToday ? 'Workout done ✓' : 'Time to move'}
            text={workedOutToday ? 'Great job today' : 'Start a workout →'}
          />
        </div>

        {/* Nutrition */}
        <SectionTitle>Nutrition</SectionTitle>
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <MacroBar label="Calories" value={todayNut.calories} target={settings.calorieTarget} unit="kcal" color="bg-meal" />
            <MacroBar label="Protein" value={todayNut.protein} target={settings.proteinTarget} unit="g" color="bg-sky" />
          </div>
          <p className="mt-5 text-[13px] font-semibold text-muted">Planned calories this week</p>
          <div className="mt-2 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekNut} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="22%">
                <XAxis dataKey="label" {...axis} />
                <YAxis hide domain={[0, (max: number) => Math.max(max, settings.calorieTarget) * 1.1]} />
                <ReferenceLine y={settings.calorieTarget} stroke={C.muted} strokeDasharray="4 4" strokeOpacity={0.6} />
                <Tooltip cursor={{ fill: 'rgba(138,138,147,0.12)' }} content={<ChartTip unit="kcal" />} labelFormatter={(_, p) => (p?.[0] ? monthDay(p[0].payload.date) : '')} />
                <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
                  {weekNut.map((d) => (
                    <Cell key={d.date} fill={C.meal} fillOpacity={d.date === t ? 1 : 0.45} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-right text-[11px] text-muted">- - - daily target {settings.calorieTarget.toLocaleString()} kcal</p>
        </Card>

        {/* Body weight */}
        <SectionTitle
          action={
            <button onClick={() => { setWeightDraft(lastWeight); setWeightOpen(true) }} className="press flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-[14px] font-semibold text-sky shadow-sm">
              <Plus size={16} /> Log
            </button>
          }
        >
          Body weight
        </SectionTitle>
        <Card>
          {weightData.length === 0 ? (
            <EmptyState emoji="⚖️" title="No weigh-ins yet" text="Log your weight to see your trend." />
          ) : (
            <>
              <div className="flex items-end justify-between">
                <Stat value={weightData.at(-1)!.value} unit={settings.weightUnit} label={`Latest · ${monthDay(weightData.at(-1)!.date)}`} />
                {weightData.length > 1 && (
                  <span className="flex items-center gap-1 rounded-full bg-card2 px-2.5 py-1 text-[13px] font-semibold">
                    {weightChange <= 0 ? <TrendingDown size={15} className="text-meal" /> : <TrendingUp size={15} className="text-fit" />}
                    {weightChange > 0 ? '+' : ''}{weightChange} {settings.weightUnit}
                  </span>
                )}
              </div>
              <div className="mt-3 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData} margin={{ top: 6, right: 6, bottom: 0, left: -18 }}>
                    <XAxis dataKey="date" {...axis} tickFormatter={monthDay} minTickGap={40} />
                    <YAxis {...axis} domain={[(m: number) => Math.floor(m - 2), (m: number) => Math.ceil(m + 2)]} allowDecimals={false} tickFormatter={(v) => Math.round(v).toString()} width={44} />
                    <Tooltip cursor={{ stroke: C.muted, strokeOpacity: 0.4 }} content={<ChartTip unit={settings.weightUnit} fmt={monthDay} />} />
                    <Line type="monotone" dataKey="value" stroke={C.sky} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </Card>

        {/* Strength */}
        <SectionTitle>Strength progress</SectionTitle>
        <Card>
          {exercises.length === 0 ? (
            <EmptyState emoji="🏋️" title="No lifts logged yet" text="Finish a strength workout to see your progress." />
          ) : (
            <>
              <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                {exercises.slice(0, 8).map((e) => (
                  <Chip key={e} active={e === activeLift} color="fit" onClick={() => setLift(e)}>{e}</Chip>
                ))}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <Stat value={liftData.at(-1)?.e1rm ?? 0} unit={settings.weightUnit} label="Estimated 1-rep max" />
                {liftGain !== 0 && (
                  <span className="rounded-full bg-fit-soft px-2.5 py-1 text-[13px] font-semibold">
                    {liftGain > 0 ? '+' : ''}{liftGain} {settings.weightUnit} since start
                  </span>
                )}
              </div>
              <div className="mt-3 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liftData} margin={{ top: 6, right: 6, bottom: 0, left: -18 }}>
                    <defs>
                      <linearGradient id="liftFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.fit} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={C.fit} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" {...axis} tickFormatter={monthDay} minTickGap={40} />
                    <YAxis {...axis} domain={[(m: number) => Math.floor((m - 5) / 10) * 10, (m: number) => Math.ceil((m + 5) / 10) * 10]} allowDecimals={false} tickFormatter={(v) => Math.round(v).toString()} width={44} />
                    <Tooltip cursor={{ stroke: C.muted, strokeOpacity: 0.4 }} content={<ChartTip unit={settings.weightUnit} fmt={monthDay} />} />
                    <Area type="monotone" dataKey="e1rm" stroke={C.fit} strokeWidth={2} fill="url(#liftFill)" dot={false} activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </Card>

        {/* Cardio */}
        <SectionTitle>Cardio this week</SectionTitle>
        <Card onClick={() => onNavigate('workouts')} className="flex items-center justify-between">
          <Stat value={cardio.minutes} unit="min" label="Time" />
          <Stat value={cardio.distance.toFixed(1)} unit={settings.distanceUnit} label="Distance" />
          <Stat value={cardio.count} label="Sessions" />
          <ChevronRight size={18} className="text-muted" />
        </Card>
      </div>

      <Sheet
        open={weightOpen}
        onClose={() => setWeightOpen(false)}
        title="⚖️ Log weight"
        footer={
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              logWeight(t, weightDraft)
              toast('Weight logged')
              setWeightOpen(false)
            }}
          >
            Save
          </Button>
        }
      >
        <div className="rounded-2xl bg-card p-4">
          <Stepper label="Today" value={weightDraft} onChange={setWeightDraft} step={0.2} suffix={settings.weightUnit} />
        </div>
      </Sheet>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

function QuickCard({ onClick, icon, tone, title, text }: { onClick: () => void; icon: ReactNode; tone: 'meal' | 'fit'; title: string; text: string }) {
  return (
    <Card onClick={onClick} className="!p-4">
      <span className={`grid h-10 w-10 place-items-center rounded-2xl ${tone === 'meal' ? 'bg-meal-soft text-meal' : 'bg-fit-soft text-fit'}`}>{icon}</span>
      <p className="mt-3 text-[16px] font-semibold leading-tight">{title}</p>
      <p className="mt-0.5 truncate text-[14px] text-muted">{text}</p>
    </Card>
  )
}

function MacroBar({ label, value, target, unit, color }: { label: string; value: number; target: number; unit: string; color: string }) {
  const pct = Math.min(100, (value / Math.max(1, target)) * 100)
  return (
    <div>
      <p className="text-[13px] font-semibold text-muted">{label} today</p>
      <p className="mt-0.5 text-[22px] font-bold tabular-nums">
        {value.toLocaleString()}
        <span className="text-[13px] font-semibold text-muted"> / {target.toLocaleString()} {unit}</span>
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-card2">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
