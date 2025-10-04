import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, User, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/quickcheck', label: 'Quickcheck' },
    { path: '/report-scanner', label: 'Report Scanner' },
    { path: '/skin-analysis', label: 'Skin+' },
    { path: '/fun-activities', label: 'Fun Activities' },
    { path: '/feedback', label: 'Feedback' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="h-8 w-8 text-blue-600" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              MediMate+
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-100 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;