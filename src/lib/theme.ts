import type { Settings } from '../types'

type Theme = Settings['theme']

const META = { light: '#faf5ec', dark: '#14100c' }

/** Sets the colour theme. 'system' follows the phone's own light/dark setting. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)

  // keep the iPhone status-bar colour in step with the theme
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    m.dataset.scheme ??= /dark/.test(m.media) ? 'dark' : 'light' // remember which one this tag started as
    const scheme = m.dataset.scheme as 'light' | 'dark'
    m.content = META[theme === 'system' ? scheme : theme]
    if (theme === 'system') m.media = `(prefers-color-scheme: ${scheme})`
    else m.removeAttribute('media')
  })
}

export const isDark = (theme: Theme) =>
  theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
