import { useEffect, useRef, useState } from 'react'
import { Bell, Download, RotateCcw, Sparkles, Upload } from 'lucide-react'
import Sheet from '../components/Sheet'
import { Button, Field, Segmented, Stepper, inputClass } from '../components/ui'
import { toast } from '../components/Toast'
import { exportData, importData, loadSampleData, resetAll, updateSettings, useAppState, useRecipes } from '../lib/store'
import { disablePush, enablePush, getPushState, sendTestPush, syncNextWeek, type PushState } from '../lib/push'
import { today } from '../lib/date'

export default function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, plan, grocery } = useAppState()
  const recipes = useRecipes()
  const fileRef = useRef<HTMLInputElement>(null)
  const [push, setPush] = useState<PushState | 'busy'>('off')

  useEffect(() => {
    if (open) getPushState().then(setPush)
  }, [open])

  const toggleReminder = async () => {
    const was = push
    setPush('busy')
    try {
      if (was === 'on') {
        await disablePush()
        toast('Saturday reminder turned off')
      } else {
        await enablePush()
        await syncNextWeek(plan, recipes, grocery)
        toast('Saturday reminder is on 🔔')
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Something went wrong.')
    }
    setPush(await getPushState())
  }

  const reminderHint: Partial<Record<PushState, string>> = {
    unconfigured: 'Not connected yet. This switches on once the app is published online.',
    unsupported: 'On iPhone, first add Fuel & Form to your Home Screen (Share → Add to Home Screen) and open it from there. Needs iOS 16.4 or newer.',
    blocked: 'Notifications are blocked. Turn them on in iPhone Settings → Notifications → Fuel & Form.',
  }
  const canToggle = push === 'on' || push === 'off'

  const download = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `fuel-and-form-backup-${today()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <Sheet open={open} onClose={onClose} tall title="Settings">
      <div className="space-y-6 pt-1">
        <Field label="Your name">
          <input value={settings.name} onChange={(e) => updateSettings({ name: e.target.value })} placeholder="What should we call you?" className={inputClass} />
        </Field>

        <div>
          <p className="mb-1.5 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">Goals</p>
          <div className="space-y-4 rounded-2xl bg-card p-4">
            <Stepper label="Workouts / week" value={settings.weeklyGoal} min={1} onChange={(v) => updateSettings({ weeklyGoal: Math.min(7, Math.max(1, v)) })} />
            <div className="h-px bg-line" />
            <Stepper label="Calories" value={settings.calorieTarget} step={50} onChange={(v) => updateSettings({ calorieTarget: v })} suffix="kcal" />
            <div className="h-px bg-line" />
            <Stepper label="Protein" value={settings.proteinTarget} step={5} onChange={(v) => updateSettings({ proteinTarget: v })} suffix="g" />
          </div>
        </div>

        <div>
          <p className="mb-1.5 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">Reminders</p>
          <div className="rounded-2xl bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-meal-soft text-meal"><Bell size={20} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold">Saturday grocery list</p>
                <p className="text-[13px] text-muted">Every Saturday at 12:00 PM, everything to buy for next week</p>
              </div>
              <button
                role="switch"
                aria-checked={push === 'on'}
                aria-label="Saturday grocery list reminder"
                disabled={!canToggle}
                onClick={toggleReminder}
                className={`relative h-8 w-14 shrink-0 rounded-full transition disabled:opacity-40 ${push === 'on' ? 'bg-meal' : 'bg-card2'}`}
              >
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${push === 'on' ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            {reminderHint[push as PushState] && <p className="mt-3 text-[13px] leading-relaxed text-muted">{reminderHint[push as PushState]}</p>}
            {push === 'on' && (
              <Button
                variant="soft"
                className="mt-3 w-full"
                onClick={async () => {
                  try {
                    await sendTestPush()
                    toast('Test sent — it should arrive in a moment')
                  } catch (e) {
                    alert(e instanceof Error ? e.message : 'Could not send the test.')
                  }
                }}
              >
                Send a test notification
              </Button>
            )}
          </div>
        </div>

        <div>
          <p className="mb-1.5 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">Appearance</p>
          <Segmented
            options={[{ value: 'system', label: 'Auto' }, { value: 'light', label: '☀️ Light' }, { value: 'dark', label: '🌙 Dark' }]}
            value={settings.theme}
            onChange={(v) => updateSettings({ theme: v })}
          />
        </div>

        <div>
          <p className="mb-1.5 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">Units</p>
          <div className="space-y-2">
            <Segmented options={[{ value: 'lb', label: 'Pounds (lb)' }, { value: 'kg', label: 'Kilograms (kg)' }]} value={settings.weightUnit} onChange={(v) => updateSettings({ weightUnit: v })} />
            <Segmented options={[{ value: 'mi', label: 'Miles' }, { value: 'km', label: 'Kilometers' }]} value={settings.distanceUnit} onChange={(v) => updateSettings({ distanceUnit: v })} />
          </div>
        </div>

        <div>
          <p className="mb-1.5 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">Your data</p>
          <p className="mb-2 px-1 text-[14px] text-muted">Everything is saved privately on this device. Back it up now and then.</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="soft" onClick={download}><Download size={18} /> Back up</Button>
            <Button variant="soft" onClick={() => fileRef.current?.click()}><Upload size={18} /> Restore</Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                importData(await file.text())
                toast('Backup restored')
              } catch {
                alert("That file doesn't look like a Fuel & Form backup.")
              }
              e.target.value = ''
            }}
          />
          <Button
            variant="soft"
            className="mt-2 w-full"
            onClick={() => {
              if (confirm('Replace your workouts, weigh-ins and this week\'s meals with sample data?')) {
                loadSampleData()
                toast('Sample data loaded')
                onClose()
              }
            }}
          >
            <Sparkles size={18} /> Load sample data
          </Button>
          <Button
            variant="danger"
            className="mt-2 w-full"
            onClick={() => {
              if (confirm('Erase everything and start fresh? This cannot be undone.')) {
                resetAll()
                onClose()
              }
            }}
          >
            <RotateCcw size={18} /> Reset all data
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
