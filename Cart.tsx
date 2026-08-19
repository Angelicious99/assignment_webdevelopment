import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import Aside from '../components/Aside'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart()

  return (
    <div className="container">
      <div className="page-title">
        <h2>Shopping Cart</h2>
        <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
      </div>
      <div className="page-layout">
        <div className="page-main">
          {items.length === 0 ? (
            <div className="empty-state">
              <p>Your cart is empty.</p>
              <Link to="/products" className="btn btn-primary mt-2">Browse Products</Link>
            </div>
          ) : (
            <>
              <div className="card" style={{ padding: '1.5rem' }}>
                {items.map(item => (
                  <div key={item.product.id} className="cart-item">
                    <img src={item.product.image_url || ''} alt={item.product.name} />
                    <div className="cart-item-info">
                      <h4>{item.product.name}</h4>
                      <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="cart-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >-</button>
                      <span style={{ fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '80px', textAlign: 'right' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span>{totalPrice >= 100 ? 'Free' : '$9.95'}</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>${(totalPrice >= 100 ? totalPrice : totalPrice + 9.95).toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem', fontSize: '1.05rem' }}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
        <Aside />
      </div>
    </div>
  )
}
