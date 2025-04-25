import React from 'react'
import './styles/NavBar.css'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const NavBar = ({account}) => {

  return (
    <nav className='nav'>
        <Link to="/" className='site-title'>Auction DApp</Link>
        <ul>
            <CustomLink to="/">Marketplace</CustomLink>
            <CustomLink to="/auction">Auctions</CustomLink>
            <CustomLink to="/deed">Deeds</CustomLink>
            <CustomLink to="/profile">Profile</CustomLink>
            <li>Current Account : {account}</li>
        </ul>
    </nav>
  )
}

function CustomLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}

export default NavBar