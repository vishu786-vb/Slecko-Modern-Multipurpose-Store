import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__brand-name">SLEKCO</div>
            <p className="footer__brand-desc">
              Your destination for curated brands and quality products across electronics, fashion, home goods, and more.
            </p>
          </div>

          <div>
            <h4 className="footer__heading">Shop</h4>
            <div className="footer__links">
              <Link to="/products?category=electronics" className="footer__link">Electronics</Link>
              <Link to="/products?category=fashion" className="footer__link">Fashion</Link>
              <Link to="/products?category=home-living" className="footer__link">Home & Living</Link>
              <Link to="/products?category=sports-fitness" className="footer__link">Sports</Link>
              <Link to="/products?category=accessories" className="footer__link">Accessories</Link>
            </div>
          </div>

          <div>
            <h4 className="footer__heading">Company</h4>
            <div className="footer__links">
              <span className="footer__link">About Us</span>
              <span className="footer__link">Careers</span>
              <span className="footer__link">Press</span>
              <span className="footer__link">Blog</span>
            </div>
          </div>

          <div>
            <h4 className="footer__heading">Support</h4>
            <div className="footer__links">
              <span className="footer__link">Help Center</span>
              <span className="footer__link">Shipping</span>
              <span className="footer__link">Returns</span>
              <span className="footer__link">Contact Us</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">&copy; 2024 Slekco. All rights reserved.</p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="20" x="2" y="2" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
