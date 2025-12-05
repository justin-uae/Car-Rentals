import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearOrders } from '../slices/ordersSlice';
import { logout } from '../slices/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { Calendar, LogOut, Menu, ShoppingCart, UserIcon, X } from 'lucide-react';
import { CurrencySwitcher } from './CurrencySwitcher';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Logo from '../../public/favicon.png'

interface HeaderProps {
  onBookNowClick?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get auth state from Redux
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Get cart state from Redux
  const { items } = useAppSelector((state) => state.cart);

  // Calculate cart count from items
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Click-outside handler for desktop user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    dispatch(clearOrders());
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            {/* Logo Image */}
            <LazyLoadImage
              src={Logo}
              alt="JetSet Logo"
              // loading='lazy'
              className="h-8 sm:h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            {/* Brand Text */}
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white group-hover:text-red-600 transition-colors duration-300">
              JETSET <span className="text-red-600">RENTALS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-red-600 font-semibold transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/fleets"
              className="text-white hover:text-red-600 font-semibold transition-colors relative group"
            >
              Fleets
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-red-600 font-semibold transition-colors relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-red-600 font-semibold transition-colors relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Side - User Menu or Login */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="border-r border-gray-700 pr-4">
              <CurrencySwitcher />
            </div>
            {/* <Link
              to="/cart"
              className="relative p-2.5 hover:bg-gray-900 rounded-full transition-colors group"
            >
              <ShoppingCart className="w-6 h-6 text-white group-hover:text-red-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link> */}

            {isAuthenticated ? (
              // User Menu
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-900 rounded-full transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-red-700 to-red-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Member</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserIcon className="w-5 h-5" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Link
                      to="/bookings"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">My Bookings</span>
                    </Link>

                    <hr className="my-2 border-gray-200" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login/Register Buttons
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white hover:text-red-600 font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-red-600 p-2"
              aria-label="mobile-menu-button"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-1 pt-4">
              <Link
                to="/"
                className="text-white hover:bg-gray-900 hover:text-red-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/fleets"
                className="text-white hover:bg-gray-900 hover:text-red-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fleets
              </Link>
              <Link
                to="/about"
                className="text-white hover:bg-gray-900 hover:text-red-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-white hover:bg-gray-900 hover:text-red-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="py-3 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg my-2 border border-gray-700">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Currency</p>
                <div onClick={(e) => e.stopPropagation()}>
                  <CurrencySwitcher />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4 px-4 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="font-bold text-white truncate mt-1">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 text-white hover:text-red-600 py-2.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserIcon className="w-5 h-5" />
                      <span className="font-semibold">My Profile</span>
                    </Link>

                    <Link
                      to="/bookings"
                      className="flex items-center gap-3 text-white hover:text-red-600 py-2.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold">My Bookings</span>
                    </Link>

                    <Link
                      to="/cart"
                      className="flex items-center gap-3 text-white hover:text-red-600 py-2.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="font-semibold">Cart</span>
                      {cartCount > 0 && (
                        <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                          {cartCount}
                        </span>
                      )}
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 text-red-600 hover:text-red-700 py-2.5"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-semibold">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-center border-2 border-gray-700 hover:border-red-600 hover:bg-gray-900 text-white font-bold py-3 rounded-full transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      className="block text-center bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-bold py-3 rounded-full shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Rent Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;