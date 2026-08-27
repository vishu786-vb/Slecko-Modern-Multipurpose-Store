import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProducts, getCategories, getBrands } from '../services/api'
import './ProductsPage.css'

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Get current filters from URL
  const currentSearch = searchParams.get('search') || ''
  const currentCategory = searchParams.get('category') || ''
  const currentBrand = searchParams.get('brand') || ''
  const currentSort = searchParams.get('sort_by') || 'created_at'
  const currentPage = parseInt(searchParams.get('page') || '1')

  const [searchInput, setSearchInput] = useState(currentSearch)

  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  // Fetch filter options
  useEffect(() => {
    async function fetchFilters() {
      try {
        const [catRes, brandRes] = await Promise.all([getCategories(), getBrands()])
        setCategories(catRes.data)
        setBrands(brandRes.data)
      } catch (error) {
        console.error('Failed to fetch filters:', error)
      }
    }
    fetchFilters()
  }, [])

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const params = {
          page: currentPage,
          per_page: 12,
        }
        if (currentSearch) params.search = currentSearch
        if (currentCategory) params.category = currentCategory
        if (currentBrand) params.brand = currentBrand
        if (currentSort) {
          params.sort_by = currentSort
          params.sort_order = currentSort === 'price' ? 'asc' : 'desc'
        }

        const res = await getProducts(params)
        setProducts(res.data.data)
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          total: res.data.total,
        })
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [currentSearch, currentCategory, currentBrand, currentSort, currentPage])

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    newParams.delete('page') // Reset to page 1 on filter change
    setSearchParams(newParams)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateFilter('search', searchInput)
  }

  const clearFilters = () => {
    setSearchParams({})
    setSearchInput('')
  }

  const hasActiveFilters = currentSearch || currentCategory || currentBrand

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="products-page__header">
          <div>
            <h1 className="products-page__title">
              {currentCategory
                ? categories.find(c => c.slug === currentCategory)?.name || 'Products'
                : currentSearch
                  ? `Results for "${currentSearch}"`
                  : 'All Products'}
            </h1>
            {pagination && (
              <p className="products-page__count">{pagination.total} products found</p>
            )}
          </div>
          <button
            className="products-page__filter-toggle btn btn-outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/>
            </svg>
            Filters
          </button>
        </div>

        <div className="products-page__layout">
          {/* Sidebar */}
          <aside className={`products-page__sidebar ${filtersOpen ? 'open' : ''}`}>
            {/* Search */}
            <div className="filter-group">
              <h3 className="filter-group__title">Search</h3>
              <form onSubmit={handleSearch}>
                <div className="filter-search">
                  <input
                    type="text"
                    className="input"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Go</button>
                </div>
              </form>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <h3 className="filter-group__title">Categories</h3>
              <div className="filter-options">
                <button
                  className={`filter-option ${!currentCategory ? 'active' : ''}`}
                  onClick={() => updateFilter('category', '')}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-option ${currentCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => updateFilter('category', cat.slug)}
                  >
                    {cat.name}
                    <span className="filter-option__count">{cat.products_count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="filter-group">
              <h3 className="filter-group__title">Brands</h3>
              <div className="filter-options">
                <button
                  className={`filter-option ${!currentBrand ? 'active' : ''}`}
                  onClick={() => updateFilter('brand', '')}
                >
                  All Brands
                </button>
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    className={`filter-option ${currentBrand === brand.slug ? 'active' : ''}`}
                    onClick={() => updateFilter('brand', brand.slug)}
                  >
                    {brand.name}
                    <span className="filter-option__count">{brand.products_count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <h3 className="filter-group__title">Sort By</h3>
              <select
                className="input"
                value={currentSort}
                onChange={(e) => updateFilter('sort_by', e.target.value)}
              >
                <option value="created_at">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={clearFilters}>
                Clear All Filters
              </button>
            )}

            {/* Mobile close */}
            <button className="sidebar-close-mobile btn btn-primary" onClick={() => setFiltersOpen(false)}>
              Apply Filters
            </button>
          </aside>

          {/* Product Grid */}
          <div className="products-page__grid">
            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: '360px', borderRadius: 'var(--radius-lg)' }}></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`pagination__btn ${page === pagination.current_page ? 'active' : ''}`}
                        onClick={() => updateFilter('page', page.toString())}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="products-page__empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {filtersOpen && <div className="sidebar-overlay" onClick={() => setFiltersOpen(false)} />}
    </div>
  )
}

export default ProductsPage
