import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TabBar, { type Tab } from './components/TabBar'
import { Toaster } from './components/Toast'
import Dashboard from './screens/Dashboard'
import Meals from './screens/Meals'
import Recipes from './screens/Recipes'
import Workouts from './screens/Workouts'
import { useAppState, useRecipes } from './lib/store'
import { syncNextWeek } from './lib/push'
import { applyTheme } from './lib/theme'

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const { settings, plan, grocery } = useAppState()
  const recipes = useRecipes()
  const [groceryKey, setGroceryKey] = useState(0)
  useEffect(() => applyTheme(settings.theme), [settings.theme])

  // Tapping the Saturday notification opens the grocery list.
  useEffect(() => {
    const openGroceries = () => {
      setTab('meals')
      setGroceryKey((k) => k + 1)
    }
    if (location.hash === '#groceries') {
      history.replaceState(null, '', location.pathname)
      openGroceries()
    }
    const onMessage = (e: MessageEvent) => e.data?.type === 'open-groceries' && openGroceries()
    navigator.serviceWorker?.addEventListener('message', onMessage)
    return () => navigator.serviceWorker?.removeEventListener('message', onMessage)
  }, [])

  // Keep the Saturday reminder's copy of next week's list current whenever the plan changes.
  useEffect(() => {
    const id = setTimeout(() => syncNextWeek(plan, recipes, grocery), 1500)
    return () => clearTimeout(id)
  }, [plan, recipes, grocery])

  const go = (t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto min-h-full max-w-md bg-bg pb-28">
      <motion.main key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {tab === 'dashboard' && <Dashboard onNavigate={go} />}
        {tab === 'meals' && <Meals openGroceryKey={groceryKey} />}
        {tab === 'recipes' && <Recipes />}
        {tab === 'workouts' && <Workouts />}
      </motion.main>
      <TabBar tab={tab} onChange={go} />
      <Toaster />
    </div>
  )
}
