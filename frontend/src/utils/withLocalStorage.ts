export const withLocalStorage = <T>(key: string, defaultValue?: T) => {
  const destroy = () => localStorage.removeItem(key)
  return {
    set: (v?: T) => {
      if (v === undefined) destroy()
      localStorage.setItem(key, JSON.stringify(v))
    },
    get: (): T | undefined => {
      const stored = localStorage.getItem(key)
      if (stored === null) return defaultValue
      try {
        return JSON.parse(stored) as T
      } catch {
        console.error(
          `[withLocalStorage] Failed to load stored entry from ${stored}!`,
        )
        return undefined
      }
    },
    destroy,
  }
}
