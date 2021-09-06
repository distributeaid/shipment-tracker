import { WidgetInstance } from 'friendly-challenge'
import { useEffect, useRef } from 'react'

const siteKey = process.env.REACT_APP_FRIENDLYCAPTCHA_SITE_KEY

const FriendlyCaptcha = ({
  onSolution,
}: {
  onSolution: (solution: string, reset: () => void) => unknown
}) => {
  const container = useRef<HTMLDivElement>(null)
  const widget = useRef<WidgetInstance>()

  useEffect(() => {
    if (!widget.current && container.current) {
      widget.current = new WidgetInstance(container.current, {
        startMode: 'auto',
        doneCallback: (solution: string) => {
          onSolution(solution, () => {
            widget.current?.reset()
          })
        },
        errorCallback: (err: Error) => {
          console.error('There was an error when trying to solve the Captcha.')
          console.error(err)
        },
      })
    }

    return () => {
      if (widget.current !== undefined) widget.current.reset()
    }
  }, [container, onSolution])

  return <div ref={container} className="frc-captcha" data-sitekey={siteKey} />
}

export default FriendlyCaptcha
