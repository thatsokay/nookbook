import {useState, useEffect, useMemo, useCallback} from 'react'

export const useLocalStorage = (key: string, initial: string) => {
  const [item, setItem] = useState(() => {
    return localStorage.getItem(key) ?? initial
  })
  useEffect(() => localStorage.setItem(key, item), [item])
  return [item, setItem] as const
}

export const useDarkMode = () => {
  /* Use localStorage dark mode preference if available. Otherwise use
   * media query. Always set localStorage when setting dark mode.
   */
  const prefersDarkMode = matchMedia('(prefers-color-scheme: dark)').matches
  const [storedDarkMode, setStoredDarkMode] = useLocalStorage(
    'darkMode',
    `${prefersDarkMode}`,
  )
  const darkMode = useMemo(() => {
    switch (storedDarkMode) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        return prefersDarkMode
    }
  }, [prefersDarkMode, storedDarkMode])
  const setDarkMode = useCallback(
    (dark: boolean) => setStoredDarkMode(`${dark}`),
    [setStoredDarkMode],
  )
  return [darkMode, setDarkMode] as const
}
