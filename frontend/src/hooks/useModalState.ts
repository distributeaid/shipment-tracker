import { useState } from 'react'

/**
 * Use this hook to track whether a modal is visible and to update its
 * visibility.
 * @param showOnMount If true, the modal will be visible when mounted
 * @example const [isVisible, show, hide] = useModalState()
 */
const useModalState = (
  showOnMount = false,
): [boolean, () => void, () => void] => {
  const [isVisible, setIsVisible] = useState(showOnMount)
  return [isVisible, () => setIsVisible(true), () => setIsVisible(false)]
}

export default useModalState
