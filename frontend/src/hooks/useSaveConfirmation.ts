import { useEffect, useRef, useState } from 'react'

const CONFIRMATION_DURATION_MS = 3000 as const

const useSaveConfirmation = () => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const timeout = useRef<NodeJS.Timeout>()

  const triggerConfirmation = () => {
    setShowConfirmation(true)
    timeout.current = setTimeout(() => {
      setShowConfirmation(false)
    }, CONFIRMATION_DURATION_MS)
  }

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  return { showConfirmation, triggerConfirmation }
}

export default useSaveConfirmation
