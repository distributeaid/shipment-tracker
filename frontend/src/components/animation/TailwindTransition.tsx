import { FunctionComponent } from 'react'
import { CSSTransition as ReactCSSTransition } from 'react-transition-group'

/**
 * This component wraps the CSSTransition component from react-transition-group
 * The underlying problem is that we don't control the specificity of Tailwind
 * classes.
 *
 * With regular CSS transitions, we would have something like:
 *
 * .fade-exit { opacity: 1; } // Start fading out at 100% opacity
 * .fade-exit-active { opacity: 0; } // Fade to 0 opacity
 *
 * In Tailwind, this is achieved using the opacity-0 and opacity-100 classes.
 * However, if opacity-0 is defined before opacity-100, the latter will override
 * the opacity value, which means the element will not fade out.
 *
 * To cirvumvent the problem, we set the necessary classes during each step of
 * the animation:
 *
 * leaveFrom="opacity-100"
 * leaveTo="opacity-0"
 *
 * Adapted from the following gist by Adam Wathan:
 * https://gist.github.com/adamwathan/3b9f3ad1a285a2d1b482769aeb862467
 *
 * Docs for react-transition-group:
 * https://reactcommunity.org/react-transition-group/css-transition
 */

interface Props {
  timeout: number
  in?: boolean
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
}

const TailwindTransition: FunctionComponent<Props> = ({
  children,
  enter = '',
  enterFrom = '',
  enterTo = '',
  leave = '',
  leaveFrom = '',
  leaveTo = '',
  ...otherProps
}) => {
  const enterClasses = enter.split(' ').filter((s) => s.length > 0)
  const enterFromClasses = enterFrom.split(' ').filter((s) => s.length > 0)
  const enterToClasses = enterTo.split(' ').filter((s) => s.length > 0)
  const leaveClasses = leave.split(' ').filter((s) => s.length > 0)
  const leaveFromClasses = leaveFrom.split(' ').filter((s) => s.length > 0)
  const leaveToClasses = leaveTo.split(' ').filter((s) => s.length > 0)

  const addClasses = (node: HTMLElement, classes: string[]) => {
    if (classes.length > 0) {
      node.classList.add(...classes)
    }
  }

  const removeClasses = (node: HTMLElement, classes: string[]) => {
    if (classes.length > 0) {
      node.classList.remove(...classes)
    }
  }

  return (
    <ReactCSSTransition
      {...otherProps}
      appear
      unmountOnExit
      onEnter={(node: HTMLElement) => {
        addClasses(node, [...enterClasses, ...enterFromClasses])
      }}
      onEntering={(node: HTMLElement) => {
        removeClasses(node, enterFromClasses)
        addClasses(node, enterToClasses)
      }}
      onEntered={(node: HTMLElement) => {
        removeClasses(node, [...enterToClasses, ...enterClasses])
      }}
      onExit={(node) => {
        addClasses(node, [...leaveClasses, ...leaveFromClasses])
      }}
      onExiting={(node) => {
        removeClasses(node, leaveFromClasses)
        addClasses(node, leaveToClasses)
      }}
      onExited={(node) => {
        removeClasses(node, [...leaveToClasses, ...leaveClasses])
      }}
    >
      {children}
    </ReactCSSTransition>
  )
}

export default TailwindTransition
