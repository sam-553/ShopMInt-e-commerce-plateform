import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadUser,
  logout,
  removeError,
} from '../../redux/features/user/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Profile', to: '/userProfile' },
  { label: 'My Order', to: '/orders' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileRef = useRef(null);

  const { isAuthenticated, user, error, loading } = useSelector(
    (state) => state.user
  );

  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: 'userError' });
      dispatch(removeError());
    }
  }, [error, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/products?keyword=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setIsMenuOpen(false);
    setIsSearchFocused(false);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <>
      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[999]"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      <nav className="fixed top-0 w-full bg-gray-100/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md z-[1000] text-gray-900 dark:text-white">

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="shrink-0"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-[1.5rem] font-bold text-gray-800 dark:text-gray-400 cursor-pointer transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 inline-block">
              ShopMint
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-4 lg:ml-8 flex-1">
            <ul className="flex gap-5 lg:gap-8 items-center">
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="relative py-2 px-1 text-sm lg:text-base font-medium transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Interactive Search */}
          <form
            onSubmit={handleSearchSubmit}
            className={`hidden md:flex items-center transition-all duration-300 ${
              isSearchFocused
                ? 'w-[300px] lg:w-[350px]'
                : 'w-[220px] lg:w-[280px]'
            }`}
          >
            <div
              className={`relative flex items-center w-full h-10 rounded-full border transition-all duration-300 ${
                isSearchFocused
                  ? 'bg-white dark:bg-gray-800 border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm'
              }`}
            >
              <SearchIcon
                className={`ml-3 transition-all duration-300 ${
                  isSearchFocused
                    ? 'text-blue-600 scale-110'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                fontSize="small"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-gray-900 dark:text-white outline-none w-full px-3 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mr-1 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:rotate-90"
                >
                  <CloseIcon
                    fontSize="small"
                    className="text-gray-500 dark:text-gray-400"
                  />
                </button>
              )}

              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className={`mr-1 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                  searchQuery.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <SearchIcon fontSize="small" />
              </button>
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-3 md:gap-5 lg:gap-6 shrink-0">

            {/* Cart */}
            <Link
              to="/cartItem"
              className="relative p-2 rounded-full transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95"
            >
              <ShoppingCartIcon />

              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 hover:scale-110">
                {mounted && isAuthenticated ? cartItems.length : 0}
              </span>
            </Link>

            {/* User */}
            {loading ? (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
            ) : !isAuthenticated ? (
              <Link
                to="/login"
                className="p-2 rounded-full transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95"
              >
                <PersonAddIcon />
              </Link>
            ) : (
              <div ref={profileRef} className="relative">
                <img
                  src={user?.avatar?.url || '/default-avatar.png'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:scale-110 shadow-sm"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                />

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-2 min-w-[180px] z-[1001] border border-gray-200 dark:border-gray-700 animate-[fadeIn_0.2s_ease-out]">

                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 px-3 py-2 truncate border-b border-gray-100 dark:border-gray-700 mb-1">
                      {user?.name}
                    </p>

                    {user?.role === 'admin' ? (
                      <Link
                        to="/adminDashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="block text-sm px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/userProfile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block text-sm px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
                      >
                        Profile
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block text-sm text-left w-full px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="flex transition-transform duration-300">
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-100 dark:bg-gray-800 px-5 py-5 space-y-3 border-t border-gray-200 dark:border-gray-700 shadow-lg">

            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              >
                {label}
              </Link>
            ))}

            {/* Mobile Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300"
            >
              <SearchIcon className="text-gray-700 dark:text-gray-300" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-gray-900 dark:text-white outline-none w-full"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:rotate-90"
                >
                  <CloseIcon fontSize="small" />
                </button>
              )}

              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                  searchQuery.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
                }`}
              >
                <SearchIcon fontSize="small" />
              </button>
            </form>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;