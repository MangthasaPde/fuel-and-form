import { useRef } from 'react'
import { Download, RotateCcw, Sparkles, Upload } from 'lucide-react'
import Sheet from '../components/Sheet'
import { Button, Field, Segmented, Stepper, inputClass } from '../components/ui'
import { toast } from '../components/Toast'
import { exportData, importData, loadSampleData, resetAll, updateSettings, useAppState } from '../lib/store'
import { today } from '../lib/date'

export default function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings } = useAppState()
  const fileRef = useRef<HTMLInputElement>(null)

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
