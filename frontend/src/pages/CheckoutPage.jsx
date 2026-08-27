import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { checkout } from '../services/api'
import './CheckoutPage.css'

function CheckoutPage() {
  const { items, subtotal, tax, shipping, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(null)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    notes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required'
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Invalid email format'
    }
    if (!formData.shipping_address.trim()) newErrors.shipping_address = 'Address is required'
    if (!formData.shipping_city.trim()) newErrors.shipping_city = 'City is required'
    if (!formData.shipping_zip.trim()) {
      newErrors.shipping_zip = 'ZIP code is required'
    } else if (formData.shipping_zip.trim().length < 4) {
      newErrors.shipping_zip = 'ZIP code must be at least 4 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const payload = {
        ...formData,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      }
      const res = await checkout(payload)
      setOrderPlaced(res.data.order)
      clearCart()
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: error.response?.data?.error || 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="cart-page__empty">
            <h2>Your cart is empty</h2>
            <p>Add some products before checking out.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
          </div>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-success fade-in">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h2>Order Placed Successfully!</h2>
            <p>Order #{orderPlaced.order_number}</p>
            <p className="checkout-success__text">
              Thank you for your purchase. A confirmation will be sent to {orderPlaced.customer_email}.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-page__title">Checkout</h1>

        <div className="checkout-page__layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <div className="checkout-form__error-banner">{errors.general}</div>
            )}

            <div className="checkout-form__section">
              <h3 className="checkout-form__heading">Contact Information</h3>
              <div className="checkout-form__grid">
                <div className="form-group">
                  <label htmlFor="customer_name" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    className={`input ${errors.customer_name ? 'input-error' : ''}`}
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  {errors.customer_name && <span className="error-text">{errors.customer_name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="customer_email" className="form-label">Email *</label>
                  <input
                    type="email"
                    id="customer_email"
                    name="customer_email"
                    className={`input ${errors.customer_email ? 'input-error' : ''}`}
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                  {errors.customer_email && <span className="error-text">{errors.customer_email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="customer_phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    id="customer_phone"
                    name="customer_phone"
                    className="input"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="checkout-form__section">
              <h3 className="checkout-form__heading">Shipping Address</h3>
              <div className="checkout-form__grid">
                <div className="form-group form-group--full">
                  <label htmlFor="shipping_address" className="form-label">Street Address *</label>
                  <input
                    type="text"
                    id="shipping_address"
                    name="shipping_address"
                    className={`input ${errors.shipping_address ? 'input-error' : ''}`}
                    value={formData.shipping_address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Apt 4"
                  />
                  {errors.shipping_address && <span className="error-text">{errors.shipping_address}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="shipping_city" className="form-label">City *</label>
                  <input
                    type="text"
                    id="shipping_city"
                    name="shipping_city"
                    className={`input ${errors.shipping_city ? 'input-error' : ''}`}
                    value={formData.shipping_city}
                    onChange={handleChange}
                    placeholder="New York"
                  />
                  {errors.shipping_city && <span className="error-text">{errors.shipping_city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="shipping_state" className="form-label">State</label>
                  <input
                    type="text"
                    id="shipping_state"
                    name="shipping_state"
                    className="input"
                    value={formData.shipping_state}
                    onChange={handleChange}
                    placeholder="NY"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="shipping_zip" className="form-label">ZIP Code *</label>
                  <input
                    type="text"
                    id="shipping_zip"
                    name="shipping_zip"
                    className={`input ${errors.shipping_zip ? 'input-error' : ''}`}
                    value={formData.shipping_zip}
                    onChange={handleChange}
                    placeholder="10001"
                  />
                  {errors.shipping_zip && <span className="error-text">{errors.shipping_zip}</span>}
                </div>
              </div>
            </div>

            <div className="checkout-form__section">
              <h3 className="checkout-form__heading">Order Notes</h3>
              <div className="form-group">
                <textarea
                  id="notes"
                  name="notes"
                  className="input"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special delivery instructions (optional)"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-accent btn-lg checkout-form__submit"
              disabled={loading}
            >
              {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary sidebar */}
          <div className="checkout-page__sidebar">
            <div className="order-summary">
              <h3 className="order-summary__title">Your Order</h3>
              <div className="checkout-items">
                {items.map(item => (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item__image">
                      <img src={item.thumbnail} alt={item.name} />
                      <span className="checkout-item__qty">{item.quantity}</span>
                    </div>
                    <div className="checkout-item__info">
                      <span className="checkout-item__name">{item.name}</span>
                    </div>
                    <span className="checkout-item__total">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-summary__divider"></div>
              <div className="order-summary__row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="order-summary__row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="order-summary__row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="order-summary__free">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="order-summary__divider"></div>
              <div className="order-summary__row order-summary__total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
