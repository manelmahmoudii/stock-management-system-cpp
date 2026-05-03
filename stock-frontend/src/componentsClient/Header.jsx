// src/components/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/client/imagesClient/logo/logo-icon.svg';

export default function Header() {
  const [cartCount] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      {/* Top bar */}
      <div className="bg-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex sm:flex-row gap-2 justify-between flex-col items-center">
          <div className="gap-5 order-2 sm:order-1 hidden lg:flex">
            <div className="relative">
              <button className="flex items-center cursor-pointer gap-2 w-full font-medium text-left text-base text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5.91748 10.001C5.91748 9.40261 5.94713 8.81689 6.00146 8.25098H3.26416C3.1193 8.8101 3.0425 9.39658 3.04248 10.001C3.04248 10.6053 3.11936 11.1919 3.26416 11.751H6.00146C5.94712 11.185 5.91749 10.5994 5.91748 10.001ZM7.74365 13.251C7.89637 13.9668 8.09628 14.609 8.33154 15.1533C8.60881 15.7947 8.91999 16.2668 9.22705 16.5674C9.49289 16.8275 9.72558 16.9329 9.91943 16.9551L10.0005 16.959C10.2092 16.9588 10.4694 16.8644 10.7729 16.5674C11.0801 16.2668 11.3911 15.7948 11.6685 15.1533C11.9038 14.609 12.1036 13.9668 12.2563 13.251H7.74365ZM3.84814 13.251C4.59227 14.6569 5.80273 15.7778 7.2749 16.4053C7.16112 16.1968 7.05433 15.9775 6.95557 15.749C6.64224 15.0242 6.39133 14.1784 6.21436 13.251H3.84814ZM13.7866 13.251C13.6096 14.1784 13.3588 15.0242 13.0454 15.749C12.9465 15.9777 12.8381 16.1966 12.7241 16.4053C14.1967 15.7779 15.4076 14.6572 16.1519 13.251H13.7866ZM12.7251 3.59668C12.839 3.80526 12.9466 4.02438 13.0454 4.25293C13.3588 4.97776 13.6096 5.82354 13.7866 6.75098H16.1519C15.4077 5.34517 14.1972 4.22403 12.7251 3.59668ZM10.0005 3.04297C9.79162 3.04297 9.53076 3.13745 9.22705 3.43457C8.91994 3.73502 8.60886 4.20719 8.33154 4.84863C8.09626 5.39295 7.89638 6.03514 7.74365 6.75098H12.2563C12.1036 6.03513 11.9038 5.39295 11.6685 4.84863C11.3911 4.20719 11.0801 3.73503 10.7729 3.43457C10.4695 3.13772 10.2093 3.04311 10.0005 3.04297ZM7.27393 3.59668C5.80218 4.22411 4.59217 5.34544 3.84814 6.75098H6.21436C6.39133 5.82357 6.6422 4.97774 6.95557 4.25293C7.05428 4.02463 7.16021 3.80506 7.27393 3.59668ZM7.41748 10.001C7.41749 10.6071 7.4496 11.193 7.5083 11.751H12.4917C12.5504 11.193 12.5825 10.6071 12.5825 10.001C12.5825 9.39494 12.5504 8.80886 12.4917 8.25098H7.5083C7.44962 8.80885 7.41748 9.39496 7.41748 10.001ZM14.0825 10.001C14.0825 10.5994 14.0539 11.185 13.9995 11.751H16.7358C16.8806 11.1919 16.9575 10.6053 16.9575 10.001C16.9575 9.39658 16.8807 8.81011 16.7358 8.25098H13.9995C14.0539 8.81687 14.0825 9.40263 14.0825 10.001ZM18.4575 10.001C18.4575 10.9599 18.2955 11.8809 18.0015 12.7402C17.9946 12.7606 17.9895 12.7813 17.981 12.8008C16.8254 16.0956 13.6899 18.4588 10.0005 18.459C6.31425 18.459 3.18117 16.0998 2.02295 12.8096C2.00326 12.7662 1.98727 12.7212 1.97607 12.6738C1.69634 11.8335 1.54248 10.9352 1.54248 10.001C1.54251 9.06918 1.69575 8.17338 1.97412 7.33496C1.98548 7.28485 2.00211 7.23715 2.02295 7.19141C3.18153 3.90185 6.31473 1.54297 10.0005 1.54297L10.4351 1.55371C13.9342 1.73103 16.8707 4.03621 17.981 7.2002C17.99 7.2209 17.9952 7.24302 18.0024 7.26465C18.2959 8.12317 18.4575 9.04309 18.4575 10.001Z" fill="currentColor"></path>
                </svg>
                <span>English</span>
                <svg className="" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                  <path d="M4.79163 7.39648L9.99996 12.6048L15.2083 7.39648" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>
            <div className="relative">
              <button className="gap-2 items-center inline-flex cursor-pointer text-sm font-medium text-gray-900">
                <img className="rounded-full w-5 h-5" alt="USD flag" src="https://flagcdn.com/w20/us.png" />
                <span>USD</span>
                <svg className="" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                  <path d="M4.79163 7.39648L9.99996 12.6048L15.2083 7.39648" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>
          </div>
          <p className="text-gray-900 text-sm font-medium order-1 sm:order-2">Flash Sale Live – 30% Off Everything</p>
          <div className="hidden sm:block order-3">
            <Link className="flex gap-2 text-sm items-center font-medium text-gray-900" to="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.3289 3.875C11.6009 3.87514 12.6316 4.90664 12.6316 6.17871C12.6315 7.45067 11.6008 8.48131 10.3289 8.48145C9.05679 8.48145 8.0253 7.45075 8.02516 6.17871C8.02516 4.90655 9.05671 3.875 10.3289 3.875ZM10.3289 9.98145C12.4293 9.98131 14.1315 8.2791 14.1316 6.17871C14.1316 4.07821 12.4293 2.37514 10.3289 2.375C8.22828 2.375 6.52516 4.07812 6.52516 6.17871C6.5253 8.27918 8.22836 9.98145 10.3289 9.98145ZM15.9504 16.7449V17.033C15.9504 17.4472 16.2862 17.783 16.7004 17.783C17.1145 17.7828 17.4504 17.4471 17.4504 17.033V16.7449C17.4504 13.5889 14.8915 11.03 11.7356 11.03H8.9231C5.76714 11.03 3.20825 13.5889 3.20825 16.7449V17.033C3.20825 17.4472 3.54404 17.783 3.95825 17.783C4.37247 17.783 4.70825 17.4472 4.70825 17.033V16.7449C4.70825 14.4174 6.59557 12.53 8.9231 12.53H11.7356C14.0631 12.53 15.9504 14.4174 15.9504 16.7449Z" fill="currentColor"></path>
              </svg>
              Sign In / Register
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="bg-white py-4 lg:py-0 border-b border-gray-100 sticky top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Bouton menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg w-10 h-10 text-gray-700 bg-gray-100 focus:outline-none cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20 5C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7L4 7C3.44772 7 3 6.55229 3 6C3 5.44772 3.44772 5 4 5H20ZM20 17C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19L4 19C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17L20 17ZM21 12C21 11.4477 20.5523 11 20 11L4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13L20 13C20.5523 13 21 12.5523 21 12Z" fill="currentColor"></path>
              </svg>
            </button>

            {/* Logo + TechMarket */}
            <div className="flex items-center">
              <Link to="/client" className="flex items-center gap-2.5">
                <img className="logo-img h-7 w-auto" alt="TechSelf Logo" src={logo} />
                <span className="text-xl font-bold text-gray-800 hidden sm:inline-block">
                  TechMarket
                </span>
              </Link>
              <div className="relative ml-6 hidden lg:block">
                <input
                  placeholder="Search products.."
                  className="px-4 py-2.5 pl-10 w-[350px] border focus:border-violet-300 h-11 placeholder:text-gray-400 placeholder:text-base text-gray-800 border-gray-300 rounded-lg focus:outline-0 text-base ring-3 ring-transparent focus:ring-violet-500/30"
                  type="text"
                />
                <span className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.4375 2.3125C13.3726 2.3125 16.5634 5.5019 16.5635 9.43652C16.5635 11.1342 15.9681 12.6921 14.9766 13.916L17.4688 16.4082C17.7609 16.7011 17.7604 17.1761 17.4678 17.4688C17.175 17.7612 16.7 17.7612 16.4072 17.4688L13.915 14.9756C12.6911 15.9656 11.1343 16.5605 9.4375 16.5605C5.50258 16.5603 2.3125 13.3711 2.3125 9.43652C2.31258 5.50205 5.50263 2.31273 9.4375 2.3125ZM9.4375 3.8125C6.33077 3.81273 3.81258 6.33076 3.8125 9.43652C3.8125 12.5424 6.33073 15.0603 9.4375 15.0605C12.5445 15.0605 15.0635 12.5425 15.0635 9.43652C15.0634 6.33062 12.5444 3.8125 9.4375 3.8125Z" fill="#6B7280"></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* Liens desktop (reste identique) */}
            <div className="hidden lg:flex items-center">
              <Link className="text-gray-800 hover:text-violet-500 py-7 px-3.5 text-base font-medium transition-colors" to="/client">Home</Link>
              <Link className="text-gray-800 hover:text-violet-500 py-7 px-3.5 text-base font-medium transition-colors" to="/shop">Shop</Link>

              <div className="group px-3.5 py-7">
                <Link className="inline-flex items-center text-gray-800 transition-all cursor-pointer group-hover:text-violet-500 text-base font-medium" to="/shop" data-discover="true">
                  Products
                  <svg className="transition-transform duration-300 group-hover:rotate-180" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.79175 7.39575L10.0001 12.6041L15.2084 7.39575" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="absolute left-0 right-0 border-t mt-7 w-full py-7 border-gray-100 bg-white z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-gray-100 gap-7">
                      <div className="xl:w-2/3 flex divide-x divide-gray-100 pb-7">
                        <div className="pr-7 w-1/3">
                          <h3 className="text-gray-800 text-xl mb-3 font-medium">Smart Devices</h3>
                          <div className="space-y-3">
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">T-Shirts</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Hoodies</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Pants &amp; Shorts</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Jackets</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Shoes</Link>
                          </div>
                        </div>
                        <div className="px-7 w-1/3">
                          <h3 className="text-gray-800 text-xl mb-3 font-medium">Audio &amp; Entertainment</h3>
                          <div className="space-y-3">
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Dresses</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Tops &amp; Blouses</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Skirts &amp; Pants</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Outerwear</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Heels &amp; Flats</Link>
                          </div>
                        </div>
                        <div className="px-7 w-1/3">
                          <h3 className="text-gray-800 text-xl mb-3 font-medium">Accessories</h3>
                          <div className="space-y-3">
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Dresses</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Tops &amp; Blouses</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Skirts &amp; Pants</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Outerwear</Link>
                            <Link className="block text-gray-500 text-base transition-colors hover:text-gray-800" to="/shop" data-discover="true">Heels &amp; Flats</Link>
                          </div>
                        </div>
                      </div>
                      <div className="xl:w-1/3">
                        <div className="pl-7 relative">
                          <img className="rounded-lg w-full" alt="" src="/client/imagesClient/menu-image.jpg" />
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                            <Link className="bg-white py-2.5 px-3.5 rounded-lg hover:bg-gray-100 text-gray-800 border border-gray-300 font-medium text-sm" to="/shop" data-discover="true">Best Seller</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link className="text-gray-800 hover:text-violet-500 py-7 px-3.5 text-base font-medium transition-colors" to="/shop?filter=sale">
                Sale
                <span className="bg-violet-50 text-violet-700 inline-flex items-center justify-center h-5 rounded-full px-2 py-1 text-xs font-medium z-10 ml-1">20% OFF</span>
              </Link>
            </div>

            {/* Icônes desktop */}
            <div className="lg:flex items-center space-x-5 hidden">
              <div className="flex space-x-3">
                <button className="text-gray-700 border size-11 rounded-lg border-gray-200 inline-flex items-center justify-center hover:text-gray-900 relative cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4.21563 5.3023C2.26145 7.25648 2.26146 10.4248 4.21563 12.379L10.9393 19.1028C11.5251 19.6886 12.4749 19.6886 13.0606 19.1028L19.7844 12.3791C21.7385 10.4249 21.7385 7.25659 19.7844 5.30241C17.8302 3.34823 14.6618 3.34823 12.7076 5.30241L12 6.01001L11.2923 5.3023C9.33816 3.34813 6.16981 3.34813 4.21563 5.3023Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
                <button className="text-gray-700 border size-11 rounded-lg border-gray-200 inline-flex items-center justify-center hover:text-gray-900 relative cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18" fill="none">
                    <path d="M0.75 0.75H1.93055C2.67828 0.75 3.31181 1.30068 3.41594 2.04112L3.56788 3.12161M3.56788 3.12161L4.67 10.9589C4.77412 11.6993 5.40766 12.25 6.15538 12.25L15.5169 12.25C16.1139 12.25 16.6541 11.896 16.8923 11.3486L19.5596 5.22023C19.9908 4.2295 19.2648 3.12161 18.1843 3.12161H3.56788Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M6.2168 16.25H6.2268M14.7539 16.25H14.7639" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="rounded-full w-4.5 h-4.5 absolute -top-1 -right-1 bg-violet-500 text-white text-[10px] font-semibold inline-flex items-center justify-center">{cartCount}</span>
                </button>
              </div>
            </div>

            {/* Icônes mobile */}
            <div className="flex lg:hidden items-center gap-2.5">
              <button className="text-gray-700 border size-10 rounded-lg border-gray-200 inline-flex items-center justify-center hover:text-gray-900 relative cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4.21563 5.3023C2.26145 7.25648 2.26146 10.4248 4.21563 12.379L10.9393 19.1028C11.5251 19.6886 12.4749 19.6886 13.0606 19.1028L19.7844 12.3791C21.7385 10.4249 21.7385 7.25659 19.7844 5.30241C17.8302 3.34823 14.6618 3.34823 12.7076 5.30241L12 6.01001L11.2923 5.3023C9.33816 3.34813 6.16981 3.34813 4.21563 5.3023Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
              <button className="text-gray-700 border size-10 rounded-lg border-gray-200 inline-flex items-center justify-center hover:text-gray-900 relative cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18" fill="none">
                  <path d="M0.75 0.75H1.93055C2.67828 0.75 3.31181 1.30068 3.41594 2.04112L3.56788 3.12161M3.56788 3.12161L4.67 10.9589C4.77412 11.6993 5.40766 12.25 6.15538 12.25L15.5169 12.25C16.1139 12.25 16.6541 11.896 16.8923 11.3486L19.5596 5.22023C19.9908 4.2295 19.2648 3.12161 18.1843 3.12161H3.56788Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M6.2168 16.25H6.2268M14.7539 16.25H14.7639" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="rounded-full w-4 h-4 absolute -top-1 -right-1 bg-violet-500 text-white text-[10px] font-semibold inline-flex items-center justify-center">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}