// src/components/Footer.jsx
import footerLogo from '/client/imagesClient/logo/logo-icon.svg';

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-16 pb-4 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img className="footer-logo-img h-10 w-auto" src={footerLogo} alt="TechSelf Logo" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                TechMarket
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Discover the latest in electronics with premium quality and exceptional service.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.675-12.302c0-.21-.005-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.603-.015 2.896-.015 3.29 0 .322.216.698.83.578C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-violet-500 dark:hover:text-violet-400">All Products</a></li>
              <li><a href="#" className="hover:text-violet-500 dark:hover:text-violet-400">New Arrivals</a></li>
              <li><a href="#" className="hover:text-violet-500 dark:hover:text-violet-400">Best Sellers</a></li>
              <li><a href="#" className="hover:text-violet-500 dark:hover:text-violet-400">Sale</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Support</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-violet-500 dark:hover:text-violet-400">FAQ</a></li>
              <li><a href="#" className="hover:text-violet-500 dark:hover:text-violet-400">Shipping Info</a></li>
              <li><a href="#" className="hover:text-violet-500 dark:hover:text-violet-400">Returns</a></li>
              <li><a href="#" className="hover:text-violet-500 dark:hover:text-violet-400">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Email: support@techmarket.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Hours: Mon-Fri, 9AM-6PM</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 TechMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}