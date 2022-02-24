export const withLocalStorage = <T>(key: string, defaultValue?: T) => {
  const destroy = () => {
    localStorage.removeItem(key)
    localStorage.removeItem(`${key}__exp`)
  }
  const getExpires = (): Date | undefined => {
    const expires = localStorage.getItem(`${key}__exp`)
    if (expires === null) return
    return new Date(expires)
  }
  return {
    set: (v?: T, expires?: Date) => {
      if (v === undefined) destroy()
      localStorage.setItem(key, JSON.stringify(v))
      if (expires instanceof Date)
        localStorage.setItem(`${key}__exp`, expires.toISOString())
    },
    get: (): T | undefined => {
      const stored = localStorage.getItem(key)
      if (stored === null) return defaultValue
      const expires = getExpires()
      if ((expires?.getTime() ?? Date.now()) < Date.now()) {
        console.debug(`[withLocalStorage] ${key} expired.`)
        return defaultValue
      }
      try {
        return JSON.parse(stored) as T
      } catch {
        console.error(
          `[withLocalStorage] Failed to load stored entry for ${key} from ${stored}!`,
        )
        return undefined
      }
    },
    destroy,
    expires: getExpires,
  }
}
