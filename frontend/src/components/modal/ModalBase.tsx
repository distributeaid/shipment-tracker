/**
 * This is a fully-controlled modal wrapper. The API was written to be content-
 * agnostic, which means we can render whatever we want inside the modal
 * without overriding this code.
 *
 * Features:
 * - when the modal isn't visible, it's not in the DOM
 * - when the modal is shown, it's appended to the document.body
 * - the modal uses the correct aria attributes
 * - focus is "trapped" within the modal when it's open
 * - pressing the Escape key and clicking on the backdrop to close the modal
 *   MUST be handled by the consumer
 * - prevents the body from scrolling, without the sidebar jitter effect
 *
 * Implementation details:
 * - there needs to be at least one focusable element within the modal
 */

import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import { nanoid } from 'nanoid'
import { Component, createRef, CSSProperties, MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import TailwindTransition from '../animation/TailwindTransition'

export enum CloseReason {
  /**
   * The modal's backdrop was clicked
   */
  BackdropClicked,
  /**
   * A "Cancel" button (or similar semantic) was pressed
   */
  Cancel,
  /**
   * The Close button was pressed
   */
  CloseButton,
  /**
   * The Escape key was pressed
   */
  EscapeKey,
}

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
].join(',')

export interface ModalBaseProps {
  isOpen?: boolean
  style?: CSSProperties
  /**
   * This callback is required for accessibility purposes. It's bad practice not
   * to allow users to close the modal using the Escape key or clicking on the
   * backdrop. The consumer of this component can choose not to close the modal
   * when this callback is triggered, but I hope that by making it required, we
   * will encourage good practices.
   */
  onRequestClose: (reason: CloseReason) => void
}

export default class ModalBase extends Component<ModalBaseProps> {
  private uniqueKey: string
  private portalElement?: HTMLDivElement
  private modalContainerRef = createRef<HTMLElement>()
  private focusTrapRef = createRef<HTMLDivElement>()

  constructor(props: ModalBaseProps) {
    super(props)

    this.uniqueKey = nanoid()
  }

  componentDidMount() {
    this.portalElement = document.createElement('div')
    this.portalElement.dataset['modalId'] = this.uniqueKey
    document.body.appendChild(this.portalElement)

    // Force a render on the next frame
    setTimeout(() => {
      this.forceUpdate()

      // If the modal is open when mounted, componentDidUpdate will be skipped.
      // Thus, we set up the side effects here.
      if (this.props.isOpen) {
        this.addModalSideEffects()
      }
    })
  }

  componentDidUpdate(prevProps: ModalBaseProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.addModalSideEffects()
    } else if (prevProps.isOpen && !this.props.isOpen) {
      this.removeModalSideEffects()
    }
  }

  componentWillUnmount() {
    if (this.portalElement != null) {
      document.body.removeChild(this.portalElement)
      this.portalElement = undefined
    }

    this.removeModalSideEffects()
  }

  /**
   * Call this method when showing the modal to activate the side effects:
   * - lock the html and body elements
   * - add a keyboard listener for the Escape key
   * - focus on the first interactive element in the modal
   */
  private addModalSideEffects = () => {
    if (this.portalElement != null) {
      disableBodyScroll(this.portalElement, { reserveScrollBarGap: true })
      document.addEventListener('keydown', this.handleKeyPress)

      const focusableNodes = this.getFocusableNodes()
      if (focusableNodes.length > 0) {
        ;(focusableNodes[0] as HTMLElement).focus()
      }
    }
  }

  private removeModalSideEffects = () => {
    clearAllBodyScrollLocks()
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        this.props.onRequestClose(CloseReason.EscapeKey)
        break
      case 'Tab':
        this.handleFocusTrap(event)
        break
      default:
    }
  }

  /**
   * Returns the elements that can be focused on within the modal
   */
  private getFocusableNodes = () => {
    if (this.focusTrapRef.current) {
      const nodes = this.focusTrapRef.current.querySelectorAll(
        FOCUSABLE_ELEMENTS,
      )
      return Array.from(nodes)
    }
    return []
  }

  /**
   * Keep the focus inside the modal in case pressing Tab or Shif t+ Tab would
   * select an element outside the modal.
   */
  private handleFocusTrap = (event: KeyboardEvent) => {
    const focusableNodes = this.getFocusableNodes()

    if (focusableNodes.length === 0 || !document.activeElement) {
      return
    }

    const focusedItemIndex = focusableNodes.indexOf(document.activeElement)
    let nodeToFocus: HTMLElement | undefined

    if (event.shiftKey && focusedItemIndex === 0) {
      nodeToFocus = focusableNodes[focusableNodes.length - 1] as HTMLElement
    } else if (
      !event.shiftKey &&
      focusedItemIndex === focusableNodes.length - 1
    ) {
      nodeToFocus = focusableNodes[0] as HTMLElement
    }

    if (nodeToFocus) {
      nodeToFocus.focus()
      event.preventDefault()
    }
  }

  private onClickOutside = (event: MouseEvent) => {
    if (
      this.modalContainerRef.current &&
      this.modalContainerRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    this.props.onRequestClose(CloseReason.BackdropClicked)
  }

  render() {
    const { children, isOpen, style } = this.props

    // The portalElement is added to the DOM after mount, so the first render
    // should be skipped
    if (!this.portalElement) {
      return null
    }

    return createPortal(
      <>
        <TailwindTransition
          enter="transition duration-400"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          in={isOpen}
          leave="transition duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          timeout={400}
        >
          <div className="fixed inset-0 transition-opacity z-40">
            <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
          </div>
        </TailwindTransition>
        <TailwindTransition
          enter="transition duration-400 transform"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          in={isOpen}
          leave="transition duration-200 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-90"
          timeout={400}
        >
          <div
            className="flex inset-0 overflow-y-auto fixed w-screen z-50"
            onClick={this.onClickOutside}
            ref={this.focusTrapRef}
          >
            <aside
              aria-modal="true"
              className="relative w-full max-w-full m-auto"
              ref={this.modalContainerRef}
              role="dialog"
              style={style}
              tabIndex={-1}
            >
              {children}
            </aside>
          </div>
        </TailwindTransition>
      </>,
      this.portalElement,
    )
  }
}
