import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, Settings } from 'lucide-react';
import EmojiImage from '../common/EmojiImage';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      {/* Top Navigation */}
      <header className="bg-dark-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <EmojiImage emoji="📚" size="36" />
            <h1 className="text-2xl font-bold text-white font-kids">
              Kids English
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all font-bold font-kids ${
                  isActive(item.path)
                    ? 'bg-dark-500 text-white'
                    : 'text-light-300 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-dark-800 sticky bottom-0 z-50 border-t border-dark-700">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'text-spotify-500'
                  : 'text-light-400'
              }`}
            >
              <item.icon
                size={24}
                className={isActive(item.path) ? 'animate-bounce-slow' : ''}
              />
              <span className="text-xs font-bold font-kids">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
