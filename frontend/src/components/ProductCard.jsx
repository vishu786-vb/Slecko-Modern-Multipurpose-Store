import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const { addItem } = useCart()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < fullStars ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    }
    return stars
  }

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
        />
        <div className="product-card__badges">
          {product.discount_percentage && (
            <span className="badge badge-sale">-{product.discount_percentage}%</span>
          )}
        </div>
        <button
          className="product-card__quick-add"
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>

      <div className="product-card__info">
        {product.category && (
          <span className="product-card__category">{product.category.name}</span>
        )}
        <h3 className="product-card__name">{product.name}</h3>
        
        <div className="product-card__rating">
          <span className="product-card__stars">{renderStars(product.rating)}</span>
          <span>({product.reviews_count})</span>
        </div>

        <div className="product-card__bottom">
          <div className="product-card__price">
            <span className="product-card__current-price">${parseFloat(product.price).toFixed(2)}</span>
            {product.compare_price && (
              <span className="product-card__original-price">${parseFloat(product.compare_price).toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
