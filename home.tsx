import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type Product } from '../supabaseClient'
import { useCart } from '../CartContext'
import Aside from '../components/Aside'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProducts(data as Product[])
        setLoading(false)
      })
  }, [])

  return (
    <>
      <section className="hero">
        <img
          src="https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Vineyard landscape at sunset"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h2>The Best Drinks in the Town</h2>
          <p>Premium red and white wines, coolers, openers and accessories — delivered from our vineyard to your door.</p>
          <Link to="/products" className="btn btn-accent" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
            Shop Now
          </Link>
        </div>
      </section>

      <div className="container">
        <div className="page-layout">
          <div className="page-main">
            <section className="section">
              <div className="section-title">
                <h3>Welcome to Devon Valley Winery</h3>
                <p>A family-owned winery crafting exceptional wines since 1985</p>
              </div>
              <div className="article-body" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <p>
                  Nestled in the heart of the Devon Valley, our family-owned winery has been producing
                  award-winning wines for over three decades. We believe that great wine begins in the
                  vineyard, which is why we practice sustainable viticulture and hand-pick every grape
                  at the peak of ripeness. Our winemakers combine traditional techniques with modern
                  expertise to create wines of exceptional character, balance and depth.
                </p>
                <p>
                  Our online store brings the full Devon Valley experience to your home. Browse our
                  complete range of red and white wines, from robust Cabernet Sauvignon to crisp
                  Sauvignon Blanc. We also offer a curated selection of accessories including wine
                  coolers, corkscrews, electric openers and crystal glasses. Every product in our
                  store has been chosen to enhance your enjoyment of wine, whether you are a seasoned
                  connoisseur or just beginning to explore.
                </p>
                <p>
                  Ordering is simple and secure. Add your favourite wines to the cart, proceed to our
                  checkout, and enter your delivery details. We offer free shipping on orders over
                  $100 and a 30-day satisfaction guarantee. Explore our blog for tasting notes, food
                  pairing guides and stories from the vineyard. Have a question? Our friendly team is
                  always here to help via our Contact Us page. Thank you for choosing Devon Valley
                  Winery — we look forward to sharing our passion with you.
                </p>
              </div>
            </section>

            <section className="section">
              <div className="section-title">
                <h3>Featured Products</h3>
                <p>Our most popular wines and accessories</p>
              </div>
              {loading ? (
                <div className="loading">Loading products</div>
              ) : (
                <div className="product-grid">
                  {products.map(p => (
                    <div key={p.id} className="product-card">
                      <img src={p.image_url || ''} alt={p.name} className="product-image" />
                      <div className="product-info">
                        <span className="product-category">{p.category}</span>
                        <h4 className="product-name">{p.name}</h4>
                        <p className="product-desc">{p.description}</p>
                        <div className="product-footer">
                          <span className="product-price">${p.price.toFixed(2)}</span>
                          <button className="btn btn-primary" onClick={() => addToCart(p)}>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-center mt-2">
                <Link to="/products" className="btn btn-outline">View All Products</Link>
              </div>
            </section>
          </div>
          <Aside />
        </div>
      </div>
    </>
  )
}
