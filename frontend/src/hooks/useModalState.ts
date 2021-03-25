import { useState } from 'react'

const useModalState = (
  showOnMount = false,
): [boolean, () => void, () => void] => {
  const [isVisible, setIsVisible] = useState(showOnMount)
  return [isVisible, () => setIsVisible(true), () => setIsVisible(false)]
}

export default useModalState
