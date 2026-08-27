import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { getProduct } from '../services/api'
import './ProductDetailPage.css'

function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      setQuantity(1)
      setSelectedImage(0)
      setAdded(false)
      try {
        const res = await getProduct(slug)
        setProduct(res.data.product)
        setRelated(res.data.related)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < fullStars ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    }
    return stars
  }

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="product-detail__main">
            <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-xl)' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="skeleton" style={{ height: '24px', width: '120px' }}></div>
              <div className="skeleton" style={{ height: '40px', width: '80%' }}></div>
              <div className="skeleton" style={{ height: '20px', width: '60%' }}></div>
              <div className="skeleton" style={{ height: '36px', width: '150px' }}></div>
              <div className="skeleton" style={{ height: '80px' }}></div>
              <div className="skeleton" style={{ height: '48px' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="products-page__empty">
            <h3>Product not found</h3>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    )
  }

  const images = product.images || [product.thumbnail]

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb__separator">/</span>
          <Link to="/products">Products</Link>
          <span className="breadcrumb__separator">/</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category.slug}`}>{product.category.name}</Link>
              <span className="breadcrumb__separator">/</span>
            </>
          )}
          <span>{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="product-detail__main">
          {/* Gallery */}
          <div className="product-detail__gallery">
            <div className="product-detail__main-image">
              <img src={images[selectedImage]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="product-detail__thumbnails">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`product-detail__thumb ${idx === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-detail__info">
            {product.category && (
              <span className="product-detail__category">{product.category.name}</span>
            )}

            <h1 className="product-detail__name">{product.name}</h1>

            <div className="product-detail__rating">
              <span className="product-detail__stars">{renderStars(product.rating)}</span>
              <span className="product-detail__rating-text">
                {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>

            <div className="product-detail__price">
              <span className="product-detail__current-price">${parseFloat(product.price).toFixed(2)}</span>
              {product.compare_price && (
                <>
                  <span className="product-detail__original-price">${parseFloat(product.compare_price).toFixed(2)}</span>
                  <span className="product-detail__discount">Save {product.discount_percentage}%</span>
                </>
              )}
            </div>

            <p className="product-detail__description">{product.description}</p>

            {/* Add to Cart */}
            <div className="product-detail__actions">
              <div className="quantity-selector">
                <span className="quantity-selector__label">Quantity:</span>
                <div className="quantity-selector__controls">
                  <button
                    className="quantity-selector__btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="quantity-selector__value">{quantity}</span>
                  <button
                    className="quantity-selector__btn"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className={`btn ${added ? 'btn-accent' : 'btn-primary'} btn-lg product-detail__add-btn`}
                onClick={handleAddToCart}
                disabled={product.stock_quantity < 1}
              >
                {added ? 'Added to Cart!' : product.stock_quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Meta info */}
            <div className="product-detail__meta">
              {product.sku && (
                <div className="product-detail__meta-item">
                  <span className="product-detail__meta-label">SKU:</span>
                  <span>{product.sku}</span>
                </div>
              )}
              {product.brand && (
                <div className="product-detail__meta-item">
                  <span className="product-detail__meta-label">Brand:</span>
                  <span>{product.brand.name}</span>
                </div>
              )}
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">Availability:</span>
                <span style={{ color: product.stock_quantity > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                  {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="related-products">
            <h2 className="related-products__title">You May Also Like</h2>
            <div className="products-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage
