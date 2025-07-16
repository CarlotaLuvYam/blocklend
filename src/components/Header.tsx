import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, User, LogOut, Shield } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
	{ name: "Home", href: "/" },
	{ name: "Dashboard", href: "/dashboard" },
	{ name: "How It Works", href: "/howitworks" },
	{ name: "Apply for loan", href: "/apply" },
	{ name: "Admin", href: "/admin" }
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleLogout = () => {
    logout();
    disconnectWallet();
    setShowUserMenu(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 rounded-b-2xl'
          : 'bg-gradient-to-r from-blue-800 to-purple-800 rounded-b-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className={`text-2xl font-bold drop-shadow-sm ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              BlockLend
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-all duration-200 ease-in-out hover:text-blue-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-0 ${
                  location.pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isConnected && account ? (
  <div className="relative">
    <button
      onClick={() => setShowUserMenu(!showUserMenu)}
      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-0"
    >
      <Wallet className="h-4 w-4" />
      <span>{formatAddress(account)}</span>
    </button>
    {showUserMenu && (
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-sm text-gray-600">Connected Wallet</p>
          <p className="font-medium text-gray-900">{formatAddress(account)}</p>
          {user && (
            <p className="text-sm text-blue-600">{user.name}</p>
          )}
        </div>
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
          onClick={() => setShowUserMenu(false)}
        >
          <User className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
            onClick={() => setShowUserMenu(false)}
          >
            <Shield className="h-4 w-4" />
            <span>Admin Panel</span>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </button>
      </div>
    )}
  </div>
) : (
  <div className="flex items-center space-x-3">
    <Link
      to="/login"
      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-0 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
    >
      <User className="h-4 w-4" />
      <span>Login</span>
    </Link>
    <Link
      to="/register"
      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-0 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
    >
      <User className="h-4 w-4" />
      <span>Register</span>
    </Link>
    <button
      onClick={connectWallet}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg flex items-center space-x-2 focus:outline-none focus:ring-0"
    >
      <Wallet className="h-4 w-4" />
      <span>Connect Wallet</span>
    </button>
  </div>
)}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>
<meta name="google-site-verification" content="-s8r8hp4T76Gtb_buDFkRKPADzlwLVCCOwYdNM42KIk" />

        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-gray-700 font-medium hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                {isConnected && account ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Connected: {formatAddress(account)}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-600 font-medium"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </button>
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