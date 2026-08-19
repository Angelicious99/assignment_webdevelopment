import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase, type Product } from '../supabaseClient'
import { useCart } from '../CartContext'
import Aside from '../components/Aside'

type Category = 'all' | 'red' | 'white' | 'accessory'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()

  const category = (searchParams.get('category') as Category) || 'all'

  useEffect(() => {
    setLoading(true)
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (category !== 'all') {
      query = query.eq('category', category)
    }
    query.then(({ data, error }) => {
      if (!error && data) setProducts(data as Product[])
      setLoading(false)
    })
  }, [category])

  const setCategory = (cat: Category) => {
    if (cat === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
  }

  return (
    <div className="container">
      <div className="page-title">
        <h2>Our Products</h2>
        <p>Explore our full range of wines and accessories</p>
      </div>
      <div className="page-layout">
        <div className="page-main">
          <div className="filter-bar">
            <button
              className={`filter-btn ${category === 'all' ? 'active' : ''}`}
              onClick={() => setCategory('all')}
            >
              All Products
            </button>
            <button
              className={`filter-btn ${category === 'red' ? 'active' : ''}`}
              onClick={() => setCategory('red')}
            >
              Red Wines
            </button>
            <button
              className={`filter-btn ${category === 'white' ? 'active' : ''}`}
              onClick={() => setCategory('white')}
            >
              White Wines
            </button>
            <button
              className={`filter-btn ${category === 'accessory' ? 'active' : ''}`}
              onClick={() => setCategory('accessory')}
            >
              Accessories
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading products</div>
          ) : products.length === 0 ? (
            <div className="empty-state">No products found in this category.</div>
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
        </div>
        <Aside />
      </div>
    </div>
  )
}
