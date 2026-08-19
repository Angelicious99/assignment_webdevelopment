import { useState, type FormEvent, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useCart } from '../CartContext'
import Aside from '../components/Aside'

interface CheckoutForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  gender: string
  street: string
  suburb: string
  postcode: string
  state: string
  phone: string
}

type FormErrors = Partial<Record<keyof CheckoutForm, string>>

const initialForm: CheckoutForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  gender: '',
  street: '',
  suburb: '',
  postcode: '',
  state: '',
  phone: '',
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const [form, setForm] = useState<CheckoutForm>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.username.trim()) e.username = 'Username is required.'
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username))
      e.username = 'Username must be 3-20 characters (letters, numbers, underscore only).'

    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address.'

    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 8)
      e.password = 'Password must be at least 8 characters.'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      e.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'

    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.'
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match.'

    if (!form.firstName.trim()) e.firstName = 'First name is required.'
    else if (form.firstName.trim().length < 2) e.firstName = 'First name must be at least 2 characters.'

    if (!form.lastName.trim()) e.lastName = 'Last name is required.'
    else if (form.lastName.trim().length < 2) e.lastName = 'Last name must be at least 2 characters.'

    if (!form.gender) e.gender = 'Please select a gender.'

    if (!form.street.trim()) e.street = 'Street address is required.'
    else if (form.street.trim().length < 5) e.street = 'Please enter a full street address.'

    if (!form.suburb.trim()) e.suburb = 'Suburb is required.'

    if (!form.postcode.trim()) e.postcode = 'Postcode is required.'
    else if (!/^\d{4}$/.test(form.postcode)) e.postcode = 'Postcode must be exactly 4 digits.'

    if (!form.state) e.state = 'Please select a state.'

    if (!form.phone.trim()) e.phone = 'Phone number is required.'
    else if (!/^[0-9+\s()-]{8,15}$/.test(form.phone))
      e.phone = 'Please enter a valid phone number (8-15 digits).'

    return e
  }

  const handleChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('orders').insert({
      username: form.username.trim(),
      email: form.email.trim(),
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      gender: form.gender,
      street: form.street.trim(),
      suburb: form.suburb.trim(),
      postcode: form.postcode.trim(),
      state: form.state,
      phone: form.phone.trim(),
      cart_items: JSON.stringify(items.map(i => ({ name: i.product.name, quantity: i.quantity, price: i.product.price }))),
      total: totalPrice,
    })
    setSubmitting(false)
    if (!error) {
      setSuccess(true)
      clearCart()
      setForm(initialForm)
    }
  }

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setForm(initialForm)
    setErrors({})
    setSuccess(false)
  }

  const handleMouseOver = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.add('btn-mouseover')
  }

  const handleMouseOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.remove('btn-mouseover')
  }

  if (success) {
    return (
      <div className="container">
        <div className="page-title">
          <h2>Order Confirmed</h2>
        </div>
        <div className="page-layout">
          <div className="page-main">
            <div className="alert alert-success" style={{ fontSize: '1.1rem', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Thank you for your order!</h3>
              <p>Your order has been placed successfully. A confirmation email will be sent to you shortly.</p>
              <Link to="/products" className="btn btn-primary mt-2">Continue Shopping</Link>
            </div>
          </div>
          <Aside />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="page-title">
          <h2>Checkout</h2>
        </div>
        <div className="page-layout">
          <div className="page-main">
            <div className="empty-state">
              <p>Your cart is empty. Please add products before checking out.</p>
              <Link to="/products" className="btn btn-primary mt-2">Browse Products</Link>
            </div>
          </div>
          <Aside />
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-title">
        <h2>Checkout</h2>
        <p>Enter your details to complete your order</p>
      </div>
      <div className="page-layout">
        <div className="page-main">
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
            {items.map(item => (
              <div key={item.product.id} className="cart-summary-row">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="cart-summary-total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Your Details</h3>
            <form onSubmit={handleSubmit} noValidate>
              <h4 style={{ marginBottom: '1rem', color: 'var(--color-secondary)' }}>Account Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Username <span className="required">*</span></label>
                  <input
                    type="text"
                    id="username"
                    className={`form-input ${errors.username ? 'invalid' : ''}`}
                    value={form.username}
                    onChange={e => handleChange('username', e.target.value)}
                    placeholder="e.g. johndoe"
                  />
                  {errors.username
                    ? <span className="form-error">{errors.username}</span>
                    : <span className="form-hint">3-20 characters, letters/numbers/underscore</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'invalid' : ''}`}
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password <span className="required">*</span></label>
                  <input
                    type="password"
                    id="password"
                    className={`form-input ${errors.password ? 'invalid' : ''}`}
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    placeholder="Min 8 characters"
                  />
                  {errors.password
                    ? <span className="form-error">{errors.password}</span>
                    : <span className="form-hint">At least 8 chars with upper, lower & number</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'invalid' : ''}`}
                    value={form.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                </div>
              </div>

              <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--color-secondary)' }}>Personal Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="firstName"
                    className={`form-input ${errors.firstName ? 'invalid' : ''}`}
                    value={form.firstName}
                    onChange={e => handleChange('firstName', e.target.value)}
                    placeholder="John"
                  />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="lastName"
                    className={`form-input ${errors.lastName ? 'invalid' : ''}`}
                    value={form.lastName}
                    onChange={e => handleChange('lastName', e.target.value)}
                    placeholder="Doe"
                  />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender <span className="required">*</span></label>
                <select
                  id="gender"
                  className={`form-select ${errors.gender ? 'invalid' : ''}`}
                  value={form.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-say">Prefer not to say</option>
                </select>
                {errors.gender && <span className="form-error">{errors.gender}</span>}
              </div>

              <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--color-secondary)' }}>Shipping Address</h4>
              <div className="form-group">
                <label htmlFor="street">Street Address <span className="required">*</span></label>
                <input
                  type="text"
                  id="street"
                  className={`form-input ${errors.street ? 'invalid' : ''}`}
                  value={form.street}
                  onChange={e => handleChange('street', e.target.value)}
                  placeholder="e.g. 123 Main Street"
                />
                {errors.street && <span className="form-error">{errors.street}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="suburb">Suburb <span className="required">*</span></label>
                  <input
                    type="text"
                    id="suburb"
                    className={`form-input ${errors.suburb ? 'invalid' : ''}`}
                    value={form.suburb}
                    onChange={e => handleChange('suburb', e.target.value)}
                    placeholder="e.g. Glenelg"
                  />
                  {errors.suburb && <span className="form-error">{errors.suburb}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="postcode">Postcode <span className="required">*</span></label>
                  <input
                    type="text"
                    id="postcode"
                    className={`form-input ${errors.postcode ? 'invalid' : ''}`}
                    value={form.postcode}
                    onChange={e => handleChange('postcode', e.target.value)}
                    placeholder="e.g. 5001"
                    maxLength={4}
                  />
                  {errors.postcode && <span className="form-error">{errors.postcode}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="state">State <span className="required">*</span></label>
                  <select
                    id="state"
                    className={`form-select ${errors.state ? 'invalid' : ''}`}
                    value={form.state}
                    onChange={e => handleChange('state', e.target.value)}
                  >
                    <option value="">Select state</option>
                    <option value="SA">South Australia</option>
                    <option value="NSW">New South Wales</option>
                    <option value="VIC">Victoria</option>
                    <option value="QLD">Queensland</option>
                    <option value="WA">Western Australia</option>
                    <option value="TAS">Tasmania</option>
                    <option value="NT">Northern Territory</option>
                    <option value="ACT">Australian Capital Territory</option>
                  </select>
                  {errors.state && <span className="form-error">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    className={`form-input ${errors.phone ? 'invalid' : ''}`}
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    placeholder="e.g. 08 8123 4567"
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-submit"
                  disabled={submitting}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {submitting ? 'Placing Order...' : 'Submit Order'}
                </button>
                <button
                  type="reset"
                  className="btn btn-reset"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
        <Aside />
      </div>
    </div>
  )
}
