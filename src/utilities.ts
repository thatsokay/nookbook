import {useState, useMemo} from 'react'

export const useLocalStorage = (key: string) => {
  const storedValue = useMemo(() => localStorage.getItem(key), [])
  const [item, setItem] = useState(storedValue)
  return [
    item,
    (value: string) => {
      localStorage.setItem(key, value)
      setItem(value)
    },
  ] as const
}

export const useDarkMode = () => {
  /* Use localStorage dark mode preference if available. Otherwise use
   * media query. Always set localStorage when setting dark mode.
   */
  const prefersDarkMode = matchMedia('(prefers-color-scheme: dark)').matches
  const [storedDarkMode, setStoredDarkMode] = useLocalStorage('darkMode')
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
  return [darkMode, (dark: boolean) => setStoredDarkMode(`${dark}`)] as const
}
