import { FunctionComponent, LegacyRef, ReactNode, useRef } from 'react'
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
 *
 * ⚠️ findDomNode is deprecated, but react-transition-group hasn't kept up,
 * which means that we need a render prop to pass a ref to the child of this
 * component.
 */

const addClasses = (node: HTMLElement | null, classes: string[]) => {
  if (classes.length > 0 && node) {
    node.classList.add(...classes)
  }
}

const removeClasses = (node: HTMLElement | null, classes: string[]) => {
  if (classes.length > 0 && node) {
    node.classList.remove(...classes)
  }
}

/**
 * Split a className attribute into an array of strings so they can be added to
 * a node.classList.
 * @example splitClassesIntoArray("opacity-0 duration-100")
 * // ["opacity-0", "duration-100"]
 */
const splitClassesIntoArray = (classes: string) => {
  return classes
    .trim()
    .split(' ')
    .filter((s) => s.length)
}

interface Props {
  timeout: number
  in?: boolean
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  /**
   * A render prop is required because we must pass a ref to the child component
   */
  children: (params: { nodeRef: LegacyRef<HTMLDivElement> }) => ReactNode
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
  const nodeRef = useRef<HTMLDivElement>(null)
  const enterClasses = splitClassesIntoArray(enter)
  const enterFromClasses = splitClassesIntoArray(enterFrom)
  const enterToClasses = splitClassesIntoArray(enterTo)
  const leaveClasses = splitClassesIntoArray(leave)
  const leaveFromClasses = splitClassesIntoArray(leaveFrom)
  const leaveToClasses = splitClassesIntoArray(leaveTo)

  return (
    <ReactCSSTransition
      {...otherProps}
      nodeRef={nodeRef}
      appear
      unmountOnExit
      onEnter={() => {
        addClasses(nodeRef.current, [...enterClasses, ...enterFromClasses])
      }}
      onEntering={() => {
        removeClasses(nodeRef.current, enterFromClasses)
        addClasses(nodeRef.current, enterToClasses)
      }}
      onEntered={() => {
        removeClasses(nodeRef.current, [...enterToClasses, ...enterClasses])
      }}
      onExit={() => {
        addClasses(nodeRef.current, [...leaveClasses, ...leaveFromClasses])
      }}
      onExiting={() => {
        removeClasses(nodeRef.current, leaveFromClasses)
        addClasses(nodeRef.current, leaveToClasses)
      }}
      onExited={() => {
        removeClasses(nodeRef.current, [...leaveToClasses, ...leaveClasses])
      }}
    >
      {children({ nodeRef })}
    </ReactCSSTransition>
  )
}

export default TailwindTransition
