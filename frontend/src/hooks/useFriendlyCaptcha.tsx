import { WidgetInstance } from 'friendly-challenge'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

const siteKey = process.env.REACT_APP_FRIENDLYCAPTCHA_SITE_KEY ?? ''

type CaptchaSolution = {
  solution?: string
  element: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > | null
}

export const FriendlyCaptchaContext = createContext<CaptchaSolution>({
  element: null,
})

export const useFriendlyCaptcha = () => useContext(FriendlyCaptchaContext)

export const FriendlyCaptchaProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [solution, setSolution] = useState<string>()
  const container = useRef<HTMLDivElement>(null)
  const widget = useRef<WidgetInstance>()

  useEffect(() => {
    if (!widget.current && container.current) {
      widget.current = new WidgetInstance(container.current, {
        startMode: 'auto',
        doneCallback: (solution: string) => {
          setSolution(solution)
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
  }, [container, setSolution])

  return (
    <FriendlyCaptchaContext.Provider
      value={{
        solution,
        element:
          solution === undefined ? (
            <div
              ref={container}
              className="frc-captcha"
              data-sitekey={siteKey}
            />
          ) : null,
      }}
    >
      {children}
    </FriendlyCaptchaContext.Provider>
  )
}
