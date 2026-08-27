import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getFeaturedProducts, getCategories } from '../services/api'
import './HomePage.css'

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getFeaturedProducts(),
          getCategories(),
        ])
        setFeaturedProducts(productsRes.data)
        setCategories(categoriesRes.data)
      } catch (error) {
        console.error('Failed to fetch homepage data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <span className="hero__label">New Collection 2024</span>
            <h1 className="hero__title">
              Discover Products<br />
              That Define Your <span className="hero__accent">Style</span>
            </h1>
            <p className="hero__subtitle">
              Explore our curated selection of premium brands across electronics, fashion, home goods, and more. Quality meets design at Slekco.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/products?category=electronics" className="btn btn-outline btn-lg">Explore Electronics</Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">200+</span>
                <span className="hero__stat-label">Products</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-number">6</span>
                <span className="hero__stat-label">Brands</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-number">24/7</span>
                <span className="hero__stat-label">Support</span>
              </div>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__image-grid">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" alt="Shopping" className="hero__img hero__img--1" />
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400" alt="Fashion" className="hero__img hero__img--2" />
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" alt="Electronics" className="hero__img hero__img--3" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you need</p>
          </div>
          <div className="categories-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="category-card skeleton" style={{ height: '180px' }}></div>
              ))
            ) : (
              categories.map(category => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="category-card"
                >
                  <div className="category-card__image-wrapper">
                    <img src={category.image} alt={category.name} className="category-card__image" />
                    <div className="category-card__overlay" />
                  </div>
                  <div className="category-card__content">
                    <h3 className="category-card__name">{category.name}</h3>
                    <span className="category-card__count">{category.products_count} products</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked favorites from our collection</p>
            </div>
            <Link to="/products" className="btn btn-outline">View All</Link>
          </div>
          <div className="products-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '360px', borderRadius: 'var(--radius-lg)' }}></div>
              ))
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-banner__content">
            <h2 className="promo-banner__title">Free Shipping on Orders Over $100</h2>
            <p className="promo-banner__text">No minimum purchase required. Fast delivery to your door.</p>
            <Link to="/products" className="btn btn-accent btn-lg">Start Shopping</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
