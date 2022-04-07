import { FunctionComponent, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { NavLinkItem } from '../TopNavigation'

interface Props {
  navLinks: NavLinkItem[]
}

const DesktopNavigation: FunctionComponent<PropsWithChildren<Props>> = ({
  navLinks,
}) => {
  return (
    <nav role="navigation" className="hidden md:block w-full">
      <ul className="pl-6 flex space-x-2">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="py-2 px-4 rounded hover:bg-navy-700 transition-colors flex items-center text-white"
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

export default DesktopNavigation
