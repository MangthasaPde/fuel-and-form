// Runs inside the app's service worker. Shows the Saturday grocery notification and opens the list when tapped.

async function idFor(endpoint) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function fetchItems() {
  const cfg = await (await (await caches.open('ff-config')).match('/ff-config')).json()
  const sub = await self.registration.pushManager.getSubscription()
  const res = await fetch(`${cfg.api}/api/list?id=${await idFor(sub.endpoint)}`)
  return (await res.json()).items
}

self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      // iPhone requires every push to show a notification, so there is always a fallback message.
      let title = 'Your grocery list for next week 🛒'
      let body = 'Open Fuel & Form to see what to buy.'
      try {
        const items = await fetchItems()
        if (items.length === 0) {
          title = 'Plan next week 🍽️'
          body = 'No meals planned for next week yet. Pick a few and your grocery list will appear here.'
        } else {
          title = `Next week's groceries · ${items.length} item${items.length === 1 ? '' : 's'} 🛒`
          const shown = items.slice(0, 14).map((i) => `• ${i}`)
          body = shown.join('\n') + (items.length > 14 ? `\n+ ${items.length - 14} more` : '')
        }
      } catch {
        // offline or service unreachable: keep the fallback text
      }
      await self.registration.showNotification(title, {
        body,
        icon: self.registration.scope + 'icons/icon-192.png',
        badge: self.registration.scope + 'icons/icon-192.png',
        tag: 'saturday-groceries',
      })
    })(),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    (async () => {
      const open = await clients.matchAll({ type: 'window', includeUncontrolled: true })
      if (open.length) {
        await open[0].focus()
        open[0].postMessage({ type: 'open-groceries' })
      } else {
        await clients.openWindow(self.registration.scope + '#groceries')
      }
    })(),
  )
})
