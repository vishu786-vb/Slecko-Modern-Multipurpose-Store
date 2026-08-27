import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartPage.css'

function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, tax, shipping, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-page__empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--color-text-muted)' }}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" x2="21" y1="6" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">Shopping Cart</h1>
          <span className="cart-page__count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-page__layout">
          {/* Cart Items */}
          <div className="cart-page__items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <Link to={`/products/${item.slug}`} className="cart-item__image">
                  <img src={item.thumbnail} alt={item.name} />
                </Link>

                <div className="cart-item__info">
                  <Link to={`/products/${item.slug}`} className="cart-item__name">
                    {item.name}
                  </Link>
                  <span className="cart-item__price">${item.price.toFixed(2)}</span>
                </div>

                <div className="cart-item__quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" x2="19" y1="12" y2="12"/>
                    </svg>
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>
                    </svg>
                  </button>
                </div>

                <div className="cart-item__total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="cart-item__remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}

            <div className="cart-page__items-footer">
              <button className="btn btn-outline btn-sm" onClick={clearCart}>Clear Cart</button>
              <Link to="/products" className="btn btn-outline btn-sm">Continue Shopping</Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-page__summary">
            <div className="order-summary">
              <h3 className="order-summary__title">Order Summary</h3>

              <div className="order-summary__row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="order-summary__row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="order-summary__row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="order-summary__free">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="order-summary__hint">Free shipping on orders over $100</p>
              )}
              <div className="order-summary__divider"></div>
              <div className="order-summary__row order-summary__total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-6)' }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
