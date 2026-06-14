// src/shared/components/Layout/Header.jsx

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, Phone, Mail, LayoutDashboard, Heart, Calendar, LogOut } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import useCartStore from '../../../store/cartStore';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tours?search=${searchQuery}`);
      setMobileMenuOpen(false);
    }
  };

  const cartCount = items.length;

  // Cerrar dropdown de usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Cerrar menús al navegar
  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAllMenus();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo y Buscador */}
          <div className="flex items-center gap-8 flex-1">
            <Link to="/" className="flex items-center gap-2" onClick={closeAllMenus}>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-gray-900">B&G</span>
              </div>
              <span className="text-2xl font-black text-gray-900 hidden sm:block">
                BOOK<span className="text-yellow-500">&</span>GO
              </span>
            </Link>

            {/* Barra de búsqueda (desktop) */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="¿A dónde quieres ir?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-6">
            {/* Contacto (solo xl) */}
            <div className="hidden xl:flex items-center gap-4 text-sm">
              <a href="mailto:info@bookandgo.com" className="flex items-center gap-1 text-gray-600 hover:text-yellow-500 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">Contactanos</span>
              </a>
            </div>

            {/* Hazte Proveedor (solo md+) */}
            {(!isAuthenticated || user?.role === 'customer') && (
              <Link
                to="/become-agency"
                className="hidden md:block text-gray-700 hover:text-yellow-500 font-semibold transition-colors text-sm whitespace-nowrap"
                onClick={closeAllMenus}
              >
                Hazte Proveedor
              </Link>
            )}

            {/* Carrito */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-all"
              onClick={closeAllMenus}
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Usuario - dropdown por click (funciona en touch y desktop) */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-all"
                  aria-expanded={userMenuOpen}
                  aria-label="Menú de usuario"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block font-medium text-gray-700">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={closeAllMenus}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      to="/profile/bookings"
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={closeAllMenus}
                    >
                      Mis Reservas
                    </Link>
                    <Link
                      to="/favorites"
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={closeAllMenus}
                    >
                      Favoritos
                    </Link>
                    {user?.role === 'agency' && (
                      <Link
                        to="/agency/dashboard"
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors border-t"
                        onClick={closeAllMenus}
                      >
                        Dashboard Agencia
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition-colors border-t"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-4 sm:px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                onClick={closeAllMenus}
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block">Iniciar Sesión</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setUserMenuOpen(false);
              }}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              aria-label="Menú"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="¿A dónde quieres ir?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-yellow-500 focus:outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in border-t border-gray-100 pt-2">
            <div className="flex flex-col gap-1">
              {/* Opciones de usuario en mobile */}
              {isAuthenticated && (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 mb-1">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={closeAllMenus}
                  >
                    <User className="w-5 h-5 text-yellow-500" />
                    Mi Perfil
                  </Link>
                  <Link
                    to="/profile/bookings"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={closeAllMenus}
                  >
                    <Calendar className="w-5 h-5 text-yellow-500" />
                    Mis Reservas
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={closeAllMenus}
                  >
                    <Heart className="w-5 h-5 text-yellow-500" />
                    Favoritos
                  </Link>
                  {user?.role === 'agency' && (
                    <Link
                      to="/agency/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={closeAllMenus}
                    >
                      <LayoutDashboard className="w-5 h-5 text-yellow-500" />
                      Dashboard Agencia
                    </Link>
                  )}
                </>
              )}

              {/* Contacto */}
              <a href="tel:+51987654321" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-yellow-500" />
                <span>+51 987 654 321</span>
              </a>
              <a href="mailto:info@bookandgo.com" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-yellow-500" />
                <span>Contacto</span>
              </a>

              {/* Hazte Proveedor */}
              {(!isAuthenticated || user?.role === 'customer') && (
                <Link
                  to="/become-agency"
                  className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors font-semibold"
                  onClick={closeAllMenus}
                >
                  Hazte Proveedor
                </Link>
              )}

              {/* Logout */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors border-t border-gray-100 mt-1"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;