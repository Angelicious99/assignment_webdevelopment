import { Link } from 'react-router-dom'
import Aside from '../components/Aside'

const sitemap = [
  { path: '/', title: 'Home', desc: 'Welcome page with featured products and winery introduction.' },
  { path: '/products', title: 'Products', desc: 'Browse all red wines, white wines and accessories. Filter by category.' },
  { path: '/blog', title: 'Blog', desc: 'Read articles on wine tasting, food pairing and vineyard stories.' },
  { path: '/contact', title: 'Contact Us', desc: 'Send us a message with your questions or feedback.' },
  { path: '/checkout', title: 'Checkout', desc: 'Enter your details and complete your purchase securely.' },
  { path: '/cart', title: 'Shopping Cart', desc: 'Review items in your cart and proceed to checkout.' },
]

export default function SiteMap() {
  return (
    <div className="container">
      <div className="page-title">
        <h2>Site Map</h2>
        <p>Navigation guide for all pages on Devon Valley Winery</p>
      </div>
      <div className="page-layout">
        <div className="page-main">
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>All Pages</h3>
            <ul className="sitemap-list">
              {sitemap.map(item => (
                <li key={item.path}>
                  <Link to={item.path}>{item.title}</Link>
                  <p>{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card mt-2" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Product Categories</h3>
            <ul className="sitemap-list">
              <li>
                <Link to="/products?category=red">Red Wines</Link>
                <p>Cabernet Sauvignon, Merlot, Pinot Noir, Shiraz</p>
              </li>
              <li>
                <Link to="/products?category=white">White Wines</Link>
                <p>Chardonnay, Sauvignon Blanc, Riesling, Pinot Grigio</p>
              </li>
              <li>
                <Link to="/products?category=accessory">Accessories</Link>
                <p>Wine coolers, corkscrews, electric openers, crystal glasses</p>
              </li>
            </ul>
          </div>
        </div>
        <Aside />
      </div>
    </div>
  )
}
