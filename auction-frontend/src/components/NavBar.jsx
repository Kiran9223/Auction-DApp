import React from 'react'
import './styles/NavBar.css'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const NavBar = ({account}) => {

  return (
    <nav className='nav'>
        <Link to="/" className='site-title'>
            <div class="ironman-container">
            <div class="tech-circuits"></div>
            <div class="tech-border"></div>
            <div class="hud-frame"></div>
            <div class="repulsor-beam"></div>
            <div class="reactor-glow"></div>
            <div class="targeting-reticle"></div>
            <div class="ironman-text">Meta Mart</div>
            
            <div class="hud-element hud-top-left">SYS.42.11</div>
            <div class="hud-element hud-top-right">MARK VII</div>
            <div class="hud-element hud-bottom-left">PWR:100%</div>
            <div class="hud-element hud-bottom-right">MRK.NV</div>
            </div>
        </Link>
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