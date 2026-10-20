import { useState } from 'react'
import { motion } from 'framer-motion'
import TabBar, { type Tab } from './components/TabBar'
import { Toaster } from './components/Toast'
import Dashboard from './screens/Dashboard'
import Meals from './screens/Meals'
import Recipes from './screens/Recipes'
import Workouts from './screens/Workouts'

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard')

  const go = (t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto min-h-full max-w-md bg-bg pb-28">
      <motion.main key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {tab === 'dashboard' && <Dashboard onNavigate={go} />}
        {tab === 'meals' && <Meals />}
        {tab === 'recipes' && <Recipes />}
        {tab === 'workouts' && <Workouts />}
      </motion.main>
      <TabBar tab={tab} onChange={go} />
      <Toaster />
    </div>
  )
}
