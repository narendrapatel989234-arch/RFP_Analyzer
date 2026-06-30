'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setThemeState(savedTheme)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    let actualTheme: 'light' | 'dark'

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      actualTheme = systemDark ? 'dark' : 'light'
    } else {
      actualTheme = theme
    }

    setResolvedTheme(actualTheme)
    root.setAttribute('data-theme', actualTheme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const actualTheme = e.matches ? 'dark' : 'light'
        setResolvedTheme(actualTheme)
        document.documentElement.setAttribute('data-theme', actualTheme)
      }
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [theme])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme: setThemeState }),
    [theme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
