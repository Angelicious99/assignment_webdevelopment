import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from './CartContext'
import Home from './pages/Home'
import Products from './pages/Products'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import SiteMap from './pages/SiteMap'
import Checkout from './pages/Checkout'
import Cart from './pages/Cart'

export default function App() {
  const { totalItems } = useCart()
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setNavOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-top">
          <Link to="/" className="header-brand">
            <img src="/favicon.svg" alt="Devon Valley Winery logo" className="header-logo" />
            <div className="header-brand-text">
              <h1>Devon Valley Winery</h1>
              <span className="header-slogan">The best drinks in the town.</span>
            </div>
          </Link>
          <Link to="/cart" className="header-cart" aria-label="View cart">
            <span>Cart</span>
            <span className="cart-count">{totalItems}</span>
          </Link>
        </div>
        <nav className="nav-bar">
          <button
            className="nav-toggle"
            onClick={() => setNavOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <ul className={`nav-list ${navOpen ? 'open' : ''}`}>
            <li><NavLink to="/" end className="nav-link">Home</NavLink></li>
            <li><NavLink to="/products" className="nav-link">Products</NavLink></li>
            <li><NavLink to="/blog" className="nav-link">Blog</NavLink></li>
            <li><NavLink to="/contact" className="nav-link">Contact Us</NavLink></li>
            <li><NavLink to="/sitemap" className="nav-link">Site Map</NavLink></li>
            <li><NavLink to="/checkout" className="nav-link">Checkout</NavLink></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Devon Valley Winery</h4>
            <p>Family-owned winery crafting premium wines since 1985. From our vineyard to your glass.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/products">Shop Wines</Link>
            <Link to="/blog">Our Blog</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/sitemap">Site Map</Link>
          </div>
          <div className="footer-col">
            <h4>Categories</h4>
            <Link to="/products?category=red">Red Wines</Link>
            <Link to="/products?category=white">White Wines</Link>
            <Link to="/products?category=accessory">Accessories</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>12 Vineyard Road, Devon Valley</p>
            <p>Phone: 0452206799 </p>
            <p>Email: info@devonvalleywine.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Devon Valley Winery. All rights reserved. Please drink responsibly.</p>
        </div>
      </footer>
    </div>
  )
}
