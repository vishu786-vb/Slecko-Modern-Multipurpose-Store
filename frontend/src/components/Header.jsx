import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
      setMenuOpen(false)
    }
  }

  return (
    <header className="header">
      <div className="header__inner container">
        {/* Mobile menu button */}
        <button
          className="header__menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger ${menuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Logo */}
        <Link to="/" className="header__logo">
          <span className="logo-text">SLEKCO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`header__nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="header__nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="header__nav-link" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/products?category=electronics" className="header__nav-link" onClick={() => setMenuOpen(false)}>Electronics</Link>
          <Link to="/products?category=fashion" className="header__nav-link" onClick={() => setMenuOpen(false)}>Fashion</Link>
          <Link to="/products?category=home-living" className="header__nav-link" onClick={() => setMenuOpen(false)}>Home & Living</Link>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Search toggle */}
          <button
            className="header__action-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          {/* Cart */}
          <Link to="/cart" className="header__action-btn header__cart-btn" aria-label={`Cart with ${itemCount} items`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" x2="21" y1="6" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {itemCount > 0 && <span className="header__cart-count">{itemCount}</span>}
          </Link>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="header__search">
          <div className="container">
            <form onSubmit={handleSearch} className="header__search-form">
              <input
                type="text"
                className="header__search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && <div className="header__overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  )
}

export default Header
