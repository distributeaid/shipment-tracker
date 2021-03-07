import { FunctionComponent, useState } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { NavLinkItem } from '../TopNavigation'

interface Props {
  navLinks: NavLinkItem[]
}

const MobileNavigation: FunctionComponent<Props> = ({ navLinks }) => {
  const [showMobileNav, setShowMobileNav] = useState(false)

  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav)
  }

  return (
    <nav role="navigation" className="md:hidden">
      {/* Screenreaders work best when the button is inside the nav */}
      <button
        className={cx('burger', { 'is-active': showMobileNav })}
        type="button"
        onClick={toggleMobileNav}
        aria-label="Menu"
      >
        <span className="burger-box">
          <span className="burger-inner"></span>
        </span>
      </button>
      <div
        onClick={toggleMobileNav}
        className={cx(
          'fixed inset-x-0 top-16 bg-da-navy-100 transition-all duration-200',
          {
            'pointer-events-none h-0 delay-200': !showMobileNav,
            'h-content': showMobileNav,
          },
        )}
      ></div>
      <ul
        className={cx(
          'fixed left-0 right-0 py-4 top-16 border-t border-da-navy-200 transform-gpu transition-all duration-200',
          {
            'pointer-events-none opacity-0 -translate-y-4': !showMobileNav,
            'opacity-100 translate-y-0 delay-200': showMobileNav,
          },
        )}
      >
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="py-2 px-4 flex items-center bg-da-navy-100 text-white"
            >
              {link.icon}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MobileNavigation
